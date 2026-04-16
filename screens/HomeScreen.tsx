import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useBannerBottomInset } from '../hooks/useBannerBottomInset';
import { MapViewWrapper } from '../components/MapViewWrapper';
import { GasStationCard } from '../components/GasStationCard';
import { StationDetailSheet } from '../components/StationDetailSheet';
import { useUserLocation } from '../hooks/useUserLocation';
import { useStationsQuery } from '../hooks/useStationsQuery';
import { useGasStationsStore } from '../store/useGasStationsStore';
import { type FuelType, gasStationCorePrice } from '../types/gasStation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCop } from '../utils/format';
export default function HomeScreen() {
  const { userLocationStatus } = useUserLocation();
  const { stations, stationsStatus, stationsError, refetch } = useStationsQuery();

  const insets = useSafeAreaInsets();
  const contentBottomInset = useBannerBottomInset();
  const floatingButtonsBottom = Math.max(contentBottomInset, 10) + 28;

  const userLocation = useGasStationsStore((s) => s.userLocation);
  const viewMode = useGasStationsStore((s) => s.viewMode);
  const hasMapMoved = useGasStationsStore((s) => s.hasMapMoved);
  const mapCenter = useGasStationsStore((s) => s.mapCenter);
  const filters = useGasStationsStore((s) => s.filters);
  const orderBy = useGasStationsStore((s) => s.orderBy);
  const selectStation = useGasStationsStore((s) => s.selectStation);
  const setViewMode = useGasStationsStore((s) => s.setViewMode);
  const setSearchCenter = useGasStationsStore((s) => s.setSearchCenter);
  const setMapFocusTarget = useGasStationsStore((s) => s.setMapFocusTarget);
  const setFuelTypeFilter = useGasStationsStore((s) => s.setFuelTypeFilter);
  const setOrderBy = useGasStationsStore((s) => s.setOrderBy);
  const setPriceRangeFilter = useGasStationsStore((s) => s.setPriceRangeFilter);

  const [priceFiltersOpen, setPriceFiltersOpen] = useState(false);
  const [sortMode, setSortMode] = useState<'priceAsc' | 'priceDesc' | 'distanceAsc' | 'distanceDesc'>(
    'distanceAsc',
  );
  const [minPriceDraft, setMinPriceDraft] = useState(
    filters.minPrice !== undefined ? String(filters.minPrice) : '',
  );
  const [maxPriceDraft, setMaxPriceDraft] = useState(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : '',
  );

  const selectedFuelType: FuelType = (filters.fuelType ?? 'corriente') as FuelType;

  useEffect(() => {
    setMinPriceDraft(filters.minPrice !== undefined ? String(filters.minPrice) : '');
    setMaxPriceDraft(filters.maxPrice !== undefined ? String(filters.maxPrice) : '');
  }, [filters.maxPrice, filters.minPrice]);

  useEffect(() => {
    if (sortMode === 'distanceAsc' || sortMode === 'distanceDesc') {
      setOrderBy('distance');
      return;
    }
    setOrderBy('price');
  }, [setOrderBy, sortMode]);

  const minPriceForHighlight = useMemo(() => {
    if (stations.length === 0) return undefined;
    const prices = stations
      .map((s) => gasStationCorePrice(s, selectedFuelType))
      .filter((p): p is number => p !== undefined && Number.isFinite(p));
    if (prices.length === 0) return undefined;
    return Math.min(...prices);
  }, [selectedFuelType, stations]);

  const sortedStations = useMemo(() => {
    const list = [...stations];

    if (sortMode === 'distanceAsc') {
      list.sort((a, b) => a.distance - b.distance);
      return list;
    }

    if (sortMode === 'distanceDesc') {
      list.sort((a, b) => b.distance - a.distance);
      return list;
    }

    list.sort((a, b) => {
      const aPrice = gasStationCorePrice(a, selectedFuelType);
      const bPrice = gasStationCorePrice(b, selectedFuelType);
      const aKey =
        aPrice === undefined || !Number.isFinite(aPrice)
          ? sortMode === 'priceAsc'
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY
          : aPrice;
      const bKey =
        bPrice === undefined || !Number.isFinite(bPrice)
          ? sortMode === 'priceAsc'
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY
          : bPrice;
      return sortMode === 'priceAsc' ? aKey - bKey : bKey - aKey;
    });
    return list;
  }, [selectedFuelType, sortMode, stations]);

  const isLoading = userLocationStatus === 'loading' || stationsStatus === 'loading';
  const showEmpty = stationsStatus === 'empty';
  const showError = stationsStatus === 'error';

  const googleMapsAndroidApiKey: string | undefined =
    Constants.expoConfig?.extra?.googleMapsAndroidApiKey;
  const googleMapsIosApiKey: string | undefined = Constants.expoConfig?.extra?.googleMapsIosApiKey;
  const canRenderMap =
    Platform.OS === 'ios' ? !!googleMapsIosApiKey : !!googleMapsAndroidApiKey;
  const applyPriceRange = () => {
    const minPrice = minPriceDraft.trim() === '' ? undefined : Number(minPriceDraft);
    const maxPrice = maxPriceDraft.trim() === '' ? undefined : Number(maxPriceDraft);

    setPriceRangeFilter({
      minPrice: minPrice !== undefined && Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: maxPrice !== undefined && Number.isFinite(maxPrice) ? maxPrice : undefined,
    });
  };

  const togglePriceSort = () => {
    setSortMode((prev) => {
      if (prev === 'priceAsc') return 'priceDesc';
      if (prev === 'priceDesc') return 'priceAsc';
      return 'priceAsc';
    });
  };

  const toggleDistanceSort = () => {
    setSortMode((prev) => {
      if (prev === 'distanceAsc') return 'distanceDesc';
      if (prev === 'distanceDesc') return 'distanceAsc';
      return 'distanceAsc';
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Contenido */}
      {viewMode === 'map' ? (
        canRenderMap ? (
          userLocation ? (
            <MapViewWrapper
              userLocation={userLocation}
              stations={stations}
              onStationPress={(id) => selectStation(id)}
              selectedFuelType={selectedFuelType}
              topInset={insets.top}
              bottomInset={contentBottomInset}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="mb-2 text-neutral-900">Obteniendo ubicación...</Text>
              <ActivityIndicator />
            </View>
          )
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-neutral-900 font-bold text-lg text-center">
              Configuración de mapa incompleta
            </Text>
            <Text className="text-neutral-600 mt-2 text-center">
              {Platform.OS === 'ios'
                ? 'Agrega `GOOGLE_MAPS_IOS_API_KEY` en `.env.local` y vuelve a generar el proyecto nativo (`npx expo prebuild --clean` o `npx expo run:ios`).'
                : 'Agrega `GOOGLE_MAPS_ANDROID_API_KEY` en `.env.local`.'}
            </Text>
            <Pressable
              onPress={() => setViewMode('list')}
              className="mt-4 bg-neutral-900 rounded-xl px-4 py-3"
            >
              <Text className="text-white font-semibold">Ir a la lista</Text>
            </Pressable>
          </View>
        )
      ) : (
        <View className="flex-1">
          {/* Filtros y orden */}
          <View
            className="px-3 border-b border-neutral-200 bg-white"
            style={{ paddingTop: Math.max(insets.top, 8) + 8, paddingBottom: 12 }}
          >
            <View className="flex-row items-center">
              {(
                [
                  { label: 'Regular', value: 'corriente' as FuelType },
                  { label: 'Premium', value: 'premium' as FuelType },
                  { label: 'Diesel', value: 'diesel' as FuelType },
                ] as const
              ).map((option) => {
                const active = selectedFuelType === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setFuelTypeFilter(option.value)}
                    className={`px-4 py-2 rounded-full mr-2 border ${active ? 'bg-blue-500 border-blue-500' : 'bg-neutral-100 border-neutral-200'}`}
                  >
                    <Text className={`font-semibold ${active ? 'text-white' : 'text-neutral-800'}`}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setPriceFiltersOpen(true)}
                className={`px-4 py-2 rounded-full border ${priceFiltersOpen ? 'bg-neutral-900 border-neutral-900' : 'bg-neutral-100 border-neutral-200'}`}
              >
                <Text className={`font-semibold ${priceFiltersOpen ? 'text-white' : 'text-neutral-800'}`}>
                  Price
                </Text>
              </Pressable>
            </View>
            <View className="flex-row items-center mt-2">
              <Text className="text-neutral-400 mr-2">↕</Text>
              <Pressable
                onPress={togglePriceSort}
                className={`px-3 py-2 rounded-full mr-2 border ${sortMode === 'priceAsc' || sortMode === 'priceDesc' ? 'bg-neutral-900 border-neutral-900' : 'bg-neutral-100 border-neutral-200'}`}
              >
                <Text
                  className={`text-sm font-semibold ${sortMode === 'priceAsc' || sortMode === 'priceDesc' ? 'text-white' : 'text-neutral-500'}`}
                >
                  Precio {sortMode === 'priceDesc' ? '↓' : '↑'}
                </Text>
              </Pressable>
              <Pressable
                onPress={toggleDistanceSort}
                className={`px-3 py-2 rounded-full border ${sortMode === 'distanceAsc' || sortMode === 'distanceDesc' ? 'bg-neutral-900 border-neutral-900' : 'bg-neutral-100 border-neutral-200'}`}
              >
                <Text
                  className={`text-sm font-semibold ${sortMode === 'distanceAsc' || sortMode === 'distanceDesc' ? 'text-white' : 'text-neutral-500'}`}
                >
                  Distancia {sortMode === 'distanceDesc' ? '↓' : '↑'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Lista */}
          <FlatList
            data={sortedStations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 110 + contentBottomInset }}
            ListEmptyComponent={
              <View className="py-10 items-center">
                <Text className="text-neutral-700">Sin resultados</Text>
              </View>
            }
            renderItem={({ item }) => {
              const price = gasStationCorePrice(item, selectedFuelType);
              const highlighted =
                minPriceForHighlight !== undefined && Number.isFinite(price)
                  ? price === minPriceForHighlight
                  : false;
              return (
                <GasStationCard
                  station={item}
                  fuelType={selectedFuelType}
                  highlighted={highlighted}
                  onPress={() => selectStation(item.id)}
                />
              );
            }}
          />
        </View>
      )}

      {/* Loading / Error (overlay simple) */}
      {isLoading && (
        <View
          className="absolute left-0 top-0 right-0 bottom-0 items-center justify-center bg-white/60"
          pointerEvents="box-none"
        >
          <View className="bg-white px-4 py-3 rounded-2xl items-center">
            <ActivityIndicator />
            <Text className="mt-2 text-neutral-800">Cargando estaciones...</Text>
          </View>
        </View>
      )}

      {showEmpty && !isLoading && (
        <View
          className="absolute left-0 top-0 right-0 bottom-0 items-center justify-center"
          pointerEvents="box-none"
        >
          <View className="bg-white px-4 py-3 rounded-2xl items-center border border-neutral-200">
            <Text className="text-neutral-900 font-semibold">Sin resultados</Text>
            <Text className="text-neutral-600 mt-1">Prueba cambiar filtros o buscar en otra zona.</Text>
          </View>
        </View>
      )}

      {showError && !isLoading && (
        <View
          className="absolute left-0 top-0 right-0 bottom-0 items-center justify-center"
          pointerEvents="box-none"
        >
          <View className="bg-white px-4 py-3 rounded-2xl items-center border border-red-200">
            <Text className="text-red-700 font-semibold">Error</Text>
            <Text className="text-neutral-600 mt-1">{stationsError ?? 'Intenta de nuevo'}</Text>
            <Pressable
              onPress={refetch}
              className="mt-3 bg-neutral-900 rounded-xl px-4 py-2"
            >
              <Text className="text-white font-semibold">Reintentar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Filtros flotantes sobre mapa */}
      {viewMode === 'map' && (
        <View
          className="absolute left-0 right-0 px-3"
          pointerEvents="box-none"
          style={{ top: Math.max(insets.top, 8) + 8 }}
        >
          <View className="flex-row items-center">
            {(
              [
                { label: 'Regular', value: 'corriente' as FuelType },
                { label: 'Premium', value: 'premium' as FuelType },
                { label: 'Diesel', value: 'diesel' as FuelType },
              ] as const
            ).map((option) => {
              const active = selectedFuelType === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setFuelTypeFilter(option.value)}
                  className={`px-4 py-2 rounded-full mr-2 border ${active ? 'bg-blue-500 border-blue-500' : 'bg-white/90 border-neutral-200'}`}
                >
                  <Text className={`font-semibold ${active ? 'text-white' : 'text-neutral-800'}`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {
                setOrderBy('price');
                setPriceFiltersOpen(true);
              }}
              className={`px-4 py-2 rounded-full border ${orderBy === 'price' ? 'bg-neutral-900 border-neutral-900' : 'bg-white/90 border-neutral-200'}`}
            >
              <Text className={`font-semibold ${orderBy === 'price' ? 'text-white' : 'text-neutral-800'}`}>
                Precio
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Botón flotante inferior centrado */}
      {viewMode === 'map' && (
        <View
          className="absolute left-0 right-0"
          pointerEvents="box-none"
          style={{ bottom: floatingButtonsBottom }}
        >
          <View className="relative items-center">
            {hasMapMoved && mapCenter && (
              <View className="absolute left-3 top-1/2 -translate-y-1/2">
                <Pressable
                  onPress={() => setSearchCenter(mapCenter)}
                  className="bg-white rounded-full h-12 w-12 items-center justify-center border border-neutral-200"
                >
                  <Text className="text-neutral-900 text-2xl font-bold leading-none">↻</Text>
                </Pressable>
              </View>
            )}
            {canRenderMap && userLocation && (
              <View className="absolute right-3 top-1/2 -translate-y-1/2">
                <Pressable
                  onPress={() => setMapFocusTarget(userLocation)}
                  accessibilityRole="button"
                  accessibilityLabel="Ir a mi ubicación"
                  className="bg-white rounded-full h-12 w-12 items-center justify-center border border-neutral-200"
                >
                  <Ionicons name="locate" size={22} color="#171717" />
                </Pressable>
              </View>
            )}
            <Pressable
              onPress={() => setViewMode('list')}
              className="bg-red-600 rounded-full px-6 py-4 border border-red-700"
            >
              <Text className="text-white font-semibold">
                List View
                {minPriceForHighlight !== undefined ? ` · desde ${formatCop(minPriceForHighlight)}` : ''}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {viewMode === 'list' && (
        <View
          className="absolute left-0 right-0 items-center"
          pointerEvents="box-none"
          style={{ bottom: floatingButtonsBottom }}
        >
          <Pressable
            onPress={() => setViewMode('map')}
            className="bg-red-600 rounded-full px-6 py-4 border border-red-700"
          >
            <Text className="text-white font-semibold">Map View</Text>
          </Pressable>
        </View>
      )}

      {priceFiltersOpen && (
        <View
          className="absolute left-0 right-0 top-0 bottom-0 justify-center px-4"
          style={{ zIndex: 60, elevation: 60 }}
        >
          <Pressable
            className="absolute left-0 right-0 top-0 bottom-0 bg-black/35"
            onPress={() => setPriceFiltersOpen(false)}
          />
          <View className="bg-white border border-neutral-200 rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-neutral-900 font-bold text-base">Rango de precio</Text>
              <Pressable
                onPress={() => setPriceFiltersOpen(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
              >
                <Text className="text-neutral-700 font-bold">X</Text>
              </Pressable>
            </View>
            <Text className="text-neutral-600 mt-1">Filtrar por COP/galón del combustible seleccionado.</Text>
            <View className="flex-row mt-3 gap-2">
              <View className="flex-1">
                <Text className="text-neutral-600 text-xs mb-1">Min</Text>
                <TextInput
                  value={minPriceDraft}
                  onChangeText={setMinPriceDraft}
                  keyboardType="numeric"
                  placeholder="Ej: 12000"
                  className="border border-neutral-200 rounded-xl px-3 py-2 bg-white"
                />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-600 text-xs mb-1">Max</Text>
                <TextInput
                  value={maxPriceDraft}
                  onChangeText={setMaxPriceDraft}
                  keyboardType="numeric"
                  placeholder="Ej: 14500"
                  className="border border-neutral-200 rounded-xl px-3 py-2 bg-white"
                />
              </View>
            </View>
            <View className="flex-row mt-4 gap-2">
              <Pressable
                onPress={() => {
                  setMinPriceDraft('');
                  setMaxPriceDraft('');
                  setPriceRangeFilter({ minPrice: undefined, maxPrice: undefined });
                  setPriceFiltersOpen(false);
                }}
                className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2"
              >
                <Text className="text-center font-semibold text-neutral-800">Limpiar</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  applyPriceRange();
                  setPriceFiltersOpen(false);
                }}
                className="flex-1 bg-neutral-900 rounded-xl px-3 py-2"
              >
                <Text className="text-center font-semibold text-white">Aplicar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Bottom sheet de detalle */}
      <StationDetailSheet />
    </View>
  );
}

