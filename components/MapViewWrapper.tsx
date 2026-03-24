import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InteractionManager, Text, View, useWindowDimensions } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import SuperCluster from 'supercluster';
import type { FuelType, GasStation } from '../types/gasStation';
import type { LatLng } from '../store/useGasStationsStore';
import { useGasStationsStore } from '../store/useGasStationsStore';
import { formatCop } from '../utils/format';

type Props = {
  userLocation: LatLng;
  stations: GasStation[];
  onStationPress: (stationId: string) => void;
  selectedFuelType: FuelType;
  topInset?: number;
  bottomInset?: number;
};

type PointGeometry = { type: 'Point'; coordinates: [number, number] };

type StationPointFeature = {
  type: 'Feature';
  properties: { station: GasStation };
  geometry: PointGeometry;
};

type ClusterProperties = {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
};

function regionToBoundingBox(region: Region): [number, number, number, number] {
  const lngD =
    region.longitudeDelta < 0 ? region.longitudeDelta + 360 : region.longitudeDelta;
  return [
    region.longitude - lngD,
    region.latitude - region.latitudeDelta,
    region.longitude + lngD,
    region.latitude + region.latitudeDelta,
  ];
}

/**
 * Zoom coherente con react-native-maps: el SDK usa el mayor entre
 * longitudeDelta/width y latitudeDelta/height para fijar el encuadre (SO #50882700).
 * Los bordes visibles son centro ± delta en cada eje.
 */
function regionToClusterZoom(region: Region, mapW: number, mapH: number): number {
  if (mapW <= 0 || mapH <= 0) return 0;

  let lngHalf = region.longitudeDelta < 0 ? region.longitudeDelta + 360 : region.longitudeDelta;
  lngHalf = Math.abs(lngHalf);
  const latHalf = Math.abs(region.latitudeDelta);

  const fullLng = 2 * lngHalf;
  const fullLat = 2 * latHalf;

  if (fullLng >= 100 || fullLat >= 100) return 0;

  const longitudinalControls = lngHalf / mapW >= latHalf / mapH;

  if (longitudinalControls) {
    const z = Math.log2((360 * mapW) / (256 * fullLng));
    return clampClusterZoom(z);
  }

  const z = Math.log2((180 * mapH) / (256 * fullLat));
  return clampClusterZoom(z);
}

function clampClusterZoom(z: number): number {
  if (!Number.isFinite(z) || z < 0) return 0;
  return Math.floor(Math.min(20, z));
}

function isClusterFeature(
  f: StationPointFeature | { type: 'Feature'; properties: unknown; geometry: PointGeometry },
): f is { type: 'Feature'; properties: ClusterProperties; geometry: PointGeometry } {
  return (
    f.properties !== null &&
    typeof f.properties === 'object' &&
    'cluster' in f.properties &&
    (f.properties as { cluster?: boolean }).cluster === true
  );
}

export function MapViewWrapper({
  userLocation,
  stations,
  onStationPress,
  selectedFuelType,
  topInset = 0,
  bottomInset = 0,
}: Props) {
  const { width: winW, height: winH } = useWindowDimensions();
  const [mapSize, setMapSize] = useState({ width: winW, height: winH });

  useEffect(() => {
    setMapSize({ width: winW, height: winH });
  }, [winH, winW]);

  const setMapCenter = useGasStationsStore((s) => s.setMapCenter);
  const mapFocusTarget = useGasStationsStore((s) => s.mapFocusTarget);
  const setMapFocusTarget = useGasStationsStore((s) => s.setMapFocusTarget);
  const hasMapMoved = useGasStationsStore((s) => s.hasMapMoved);
  const mapRef = useRef<MapView | null>(null);
  const clusterIndexRef = useRef<SuperCluster | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  /** Evita rasterizar el marker antes de que el Text mida (burbujas vacías con tracksViewChanges=false). */
  const [trackPriceMarkerViews, setTrackPriceMarkerViews] = useState(true);

  const userPanningRef = useRef(false);

  useEffect(() => {
    if (!hasMapMoved) userPanningRef.current = false;
  }, [hasMapMoved]);

  const initialRegion = useMemo(() => {
    const delta = 0.05;
    return {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
  }, [userLocation.lat, userLocation.lng]);

  const effectiveRegion = mapRegion ?? initialRegion;

  const points = useMemo((): StationPointFeature[] => {
    return stations.map((station) => ({
      type: 'Feature',
      properties: { station },
      geometry: {
        type: 'Point',
        coordinates: [station.longitude, station.latitude],
      },
    }));
  }, [stations]);

  const clusterIndex = useMemo(() => {
    const w = mapSize.width;
    const index = new SuperCluster({
      // Radio algo mayor que el default (40) para agrupar antes estaciones en la misma zona.
      radius: Math.max(52, w * 0.07),
      maxZoom: 18,
      minZoom: 0,
      extent: 512,
    });
    index.load(points);
    return index;
  }, [mapSize.width, points]);

  useEffect(() => {
    clusterIndexRef.current = clusterIndex;
  }, [clusterIndex]);

  const clusters = useMemo(() => {
    const bbox = regionToBoundingBox(effectiveRegion);
    const { width: mw, height: mh } = mapSize;
    const zoom =
      effectiveRegion.longitudeDelta >= 40
        ? 0
        : regionToClusterZoom(effectiveRegion, mw, mh);
    return clusterIndex.getClusters(bbox, zoom);
  }, [clusterIndex, effectiveRegion, mapSize]);

  const visibleMarkersKey = useMemo(
    () =>
      clusters
        .map((f) =>
          isClusterFeature(f)
            ? `c${f.properties.cluster_id}`
            : `s${(f.properties as { station: GasStation }).station.id}`,
        )
        .join('|'),
    [clusters],
  );

  useEffect(() => {
    setTrackPriceMarkerViews(true);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const task = InteractionManager.runAfterInteractions(() => {
      timeoutId = setTimeout(() => setTrackPriceMarkerViews(false), 500);
    });
    return () => {
      task.cancel();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visibleMarkersKey, selectedFuelType]);

  useEffect(() => {
    if (!isMapReady || !mapFocusTarget || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: mapFocusTarget.lat,
        longitude: mapFocusTarget.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      600,
    );
    setMapCenter({ lat: mapFocusTarget.lat, lng: mapFocusTarget.lng }, false);

    setMapFocusTarget(null);
  }, [isMapReady, mapFocusTarget, setMapCenter, setMapFocusTarget]);

  const { cheapestIds, expensiveIds } = useMemo(() => {
    const pricedStations = stations
      .map((station) => ({ id: station.id, price: station.prices[selectedFuelType] }))
      .filter((item) => Number.isFinite(item.price));

    const byLow = [...pricedStations].sort((a, b) => a.price - b.price);
    const byHigh = [...pricedStations].sort((a, b) => b.price - a.price);

    return {
      cheapestIds: new Set(byLow.slice(0, 3).map((item) => item.id)),
      expensiveIds: new Set(byHigh.slice(0, 3).map((item) => item.id)),
    };
  }, [selectedFuelType, stations]);

  const fitPadding = useMemo(
    () => ({
      top: topInset + 72,
      right: 36,
      bottom: bottomInset + 148,
      left: 36,
    }),
    [bottomInset, topInset],
  );

  const onClusterPress = useCallback(
    (clusterId: number) => {
      const index = clusterIndexRef.current;
      const map = mapRef.current;
      if (!index || !map) return;

      let leaves: Array<{ geometry: PointGeometry; properties: Record<string, unknown> | null }>;
      try {
        leaves = index.getLeaves(clusterId, 500, 0);
      } catch {
        return;
      }
      if (leaves.length === 0) return;

      if (leaves.length === 1) {
        const props = leaves[0].properties as { station?: GasStation } | null;
        if (props?.station) onStationPress(props.station.id);
        return;
      }

      const coords = leaves.map((leaf) => {
        const [lng, lat] = leaf.geometry.coordinates;
        return { latitude: lat, longitude: lng };
      });
      map.fitToCoordinates(coords, { edgePadding: fitPadding, animated: true });
    },
    [fitPadding, onStationPress],
  );

  return (
    <MapView
      ref={mapRef}
      key={`${userLocation.lat}-${userLocation.lng}`}
      style={{ flex: 1 }}
      onLayout={(e) => {
        const { width: lw, height: lh } = e.nativeEvent.layout;
        if (lw > 0 && lh > 0) setMapSize({ width: lw, height: lh });
      }}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
      toolbarEnabled={false}
      onMapReady={() => setIsMapReady(true)}
      mapPadding={{
        top: topInset + 12,
        right: 12,
        bottom: bottomInset + 140,
        left: 12,
      }}
      onRegionChangeComplete={(region: Region) => {
        setMapRegion(region);
        setMapCenter({ lat: region.latitude, lng: region.longitude }, userPanningRef.current);
      }}
      onPanDrag={() => {
        userPanningRef.current = true;
      }}
    >
      {clusters.map((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;

        if (isClusterFeature(feature)) {
          const abbrev = feature.properties.point_count_abbreviated;
          const count =
            typeof abbrev === 'string' || typeof abbrev === 'number' ? String(abbrev) : '?';
          return (
            <Marker
              key={`cluster-${feature.properties.cluster_id}`}
              coordinate={{ latitude, longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              onPress={() => onClusterPress(feature.properties.cluster_id)}
            >
              <View className="bg-blue-600 min-w-[40px] h-10 px-2 rounded-full border-2 border-white items-center justify-center shadow-sm">
                <Text className="text-white font-bold text-sm">{count}</Text>
              </View>
            </Marker>
          );
        }

        const station = (feature.properties as { station: GasStation }).station;
        const price = station.prices[selectedFuelType];
        const isCheapest = cheapestIds.has(station.id);
        const isMostExpensive = expensiveIds.has(station.id);

        const markerColorClass = isCheapest
          ? 'bg-emerald-500'
          : isMostExpensive
            ? 'bg-red-500'
            : 'bg-blue-500';

        const priceLabel = formatCop(price);

        return (
          <Marker
            identifier={`label-${station.id}`}
            key={`label-${station.id}-${selectedFuelType}`}
            coordinate={{ latitude, longitude }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={trackPriceMarkerViews}
            onPress={() => onStationPress(station.id)}
            onSelect={() => onStationPress(station.id)}
          >
            <View
              className={`${markerColorClass} px-3 py-1.5 rounded-full border border-white`}
              style={{ minHeight: 30, justifyContent: 'center' }}
            >
              <Text
                className="font-bold"
                style={{ color: '#ffffff', fontSize: 12, lineHeight: 16, fontWeight: '700' }}
              >
                {priceLabel}
              </Text>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
