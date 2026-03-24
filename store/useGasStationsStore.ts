import { create } from 'zustand';
import type { FuelType, GasStation, Prices } from '../types/gasStation';

export type LatLng = { lat: number; lng: number };
export type ViewMode = 'map' | 'list';
export type OrderBy = 'price' | 'distance';

type GasStationsState = {
  // Location / search
  userLocation: LatLng | null;
  userLocationStatus: 'idle' | 'loading' | 'ready' | 'error';
  userLocationError?: string;

  mapCenter: LatLng | null;
  mapFocusTarget: LatLng | null;
  hasMapMoved: boolean;
  searchCenter: LatLng | null; // Centro usado para la última búsqueda

  // Data
  stations: GasStation[];
  stationsStatus: 'idle' | 'loading' | 'ready' | 'empty' | 'error';
  stationsError?: string;

  // Filters / sort
  filters: {
    fuelType?: FuelType;
    minPrice?: number;
    maxPrice?: number;
  };
  orderBy: OrderBy;
  viewMode: ViewMode;

  // UI
  selectedStationId: string | null;

  // Simulación de backend "edit"
  editedPricesById: Record<string, Prices>;

  // Actions
  setUserLocation: (loc: LatLng) => void;
  setUserLocationStatus: (status: GasStationsState['userLocationStatus'], error?: string) => void;
  setMapCenter: (center: LatLng, markMoved?: boolean) => void;
  setMapFocusTarget: (target: LatLng | null) => void;
  setSearchCenter: (center: LatLng) => void;

  setStations: (stations: GasStation[]) => void;
  setStationsStatus: (status: GasStationsState['stationsStatus'], error?: string) => void;

  setFuelTypeFilter: (fuelType?: FuelType) => void;
  setPriceRangeFilter: (range: { minPrice?: number; maxPrice?: number }) => void;
  resetFilters: () => void;

  setOrderBy: (orderBy: OrderBy) => void;
  setViewMode: (viewMode: ViewMode) => void;

  selectStation: (stationId: string | null) => void;
  applyEditedPrices: (stationId: string, prices: Prices) => void;
  clearEditedPrices: (stationId: string) => void;
};

export const useGasStationsStore = create<GasStationsState>()((set, get) => ({
  userLocation: null,
  userLocationStatus: 'idle',

  mapCenter: null,
  mapFocusTarget: null,
  hasMapMoved: false,
  searchCenter: null,

  stations: [],
  stationsStatus: 'idle',

  filters: {},
  orderBy: 'distance',
  viewMode: 'map',

  selectedStationId: null,

  editedPricesById: {},

  setUserLocation: (loc) =>
    set(() => ({
      userLocation: loc,
      // Si aún no tenemos centro de búsqueda, lo inicializamos con la ubicación del usuario.
      searchCenter: get().searchCenter ?? loc,
      mapCenter: get().mapCenter ?? loc,
    })),

  setUserLocationStatus: (status, error) =>
    set(() => ({
      userLocationStatus: status,
      userLocationError: error,
    })),

  setMapCenter: (center, markMoved = true) =>
    set(() => ({
      mapCenter: center,
      hasMapMoved: markMoved ? true : get().hasMapMoved,
    })),

  setMapFocusTarget: (target) =>
    set(() => ({
      mapFocusTarget: target,
    })),

  setSearchCenter: (center) =>
    set(() => ({
      searchCenter: center,
      hasMapMoved: false,
    })),

  setStations: (stations) =>
    set(() => {
      const status: GasStationsState['stationsStatus'] =
        stations.length === 0 ? 'empty' : 'ready';
      return { stations, stationsStatus: status };
    }),

  setStationsStatus: (status, error) =>
    set(() => ({ stationsStatus: status, stationsError: error })),

  setFuelTypeFilter: (fuelType) =>
    set((state) => ({
      filters: { ...state.filters, fuelType },
    })),

  setPriceRangeFilter: ({ minPrice, maxPrice }) =>
    set((state) => ({
      filters: {
        ...state.filters,
        minPrice,
        maxPrice,
      },
    })),

  resetFilters: () =>
    set(() => ({
      filters: {},
      orderBy: 'distance',
    })),

  setOrderBy: (orderBy) => set(() => ({ orderBy })),
  setViewMode: (viewMode) => set(() => ({ viewMode })),

  selectStation: (stationId) => set(() => ({ selectedStationId: stationId })),

  applyEditedPrices: (stationId, prices) =>
    set((state) => ({
      editedPricesById: {
        ...state.editedPricesById,
        [stationId]: prices,
      },
      // Actualizamos la lista visible para que el usuario vea el cambio inmediatamente.
      stations: state.stations.map((st) =>
        st.id === stationId ? { ...st, prices: { ...st.prices, ...prices } } : st,
      ),
    })),

  clearEditedPrices: (stationId) =>
    set((state) => {
      const next = { ...state.editedPricesById };
      delete next[stationId];
      return { editedPricesById: next };
    }),
}));

