import { useEffect } from "react";
import * as Location from "expo-location";
import { useGasStationsStore, type LatLng } from "../store/useGasStationsStore";

const CALI_CENTER: LatLng = { lat: 3.4516, lng: -76.532 };

async function getDeviceCoordinates(): Promise<LatLng | null> {
  const existing = await Location.getForegroundPermissionsAsync();
  const { status } =
    existing.status === "granted"
      ? existing
      : await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") return null;

  // Última posición conocida suele resolver al instante en cold start.
  const last = await Location.getLastKnownPositionAsync({ maxAge: 120_000 });
  if (last) {
    return { lat: last.coords.latitude, lng: last.coords.longitude };
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { lat: pos.coords.latitude, lng: pos.coords.longitude };
}

export function useUserLocation() {
  const userLocation = useGasStationsStore((s) => s.userLocation);
  const userLocationStatus = useGasStationsStore((s) => s.userLocationStatus);
  const userLocationError = useGasStationsStore((s) => s.userLocationError);
  const setUserLocation = useGasStationsStore((s) => s.setUserLocation);
  const setUserLocationStatus = useGasStationsStore((s) => s.setUserLocationStatus);
  const setSearchCenter = useGasStationsStore((s) => s.setSearchCenter);
  const setMapCenter = useGasStationsStore((s) => s.setMapCenter);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setUserLocationStatus("loading");

      try {
        const loc = await getDeviceCoordinates();
        if (cancelled) return;

        if (loc) {
          setUserLocation(loc);
          setSearchCenter(loc);
          setMapCenter(loc, false);
          setUserLocationStatus("ready");
          return;
        }

        // Sin permiso: centro por defecto solo para que el mapa sea usable.
        setUserLocation(CALI_CENTER);
        setSearchCenter(CALI_CENTER);
        setMapCenter(CALI_CENTER, false);
        setUserLocationStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setUserLocation(CALI_CENTER);
        setSearchCenter(CALI_CENTER);
        setMapCenter(CALI_CENTER, false);
        setUserLocationStatus("error", e instanceof Error ? e.message : "Error de ubicación");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [setUserLocation, setUserLocationStatus, setSearchCenter, setMapCenter]);

  return { userLocation, userLocationStatus, userLocationError };
}
