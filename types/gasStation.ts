export type FuelType = 'corriente' | 'extra' | 'diesel';

export type Prices = {
  corriente: number;
  extra: number;
  diesel: number;
};

/** Fila de `stations` (sin precios normalizados en DB). */
export type StationRow = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  businessName?: string;
};

/** Fila de `station_prices` (snapshot por fecha). */
export type StationPriceRow = {
  id: string;
  stationId: string;
  recordedAt: string;
  prices: Prices;
};

export type GasStation = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  prices: Prices;
  businessName?: string;
  /**
   * km al punto de búsqueda; con Supabase suele venir de una RPC/vista espacial (p. ej. PostGIS).
   */
  distanceKm?: number;
};

export type GetGasStationsParams = {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  fuelType?: FuelType;
  minPrice?: number;
  maxPrice?: number;
};

/** Registro de precios en un instante (p. ej. respuesta de historial por estación). */
export type PriceHistoryEntry = {
  recordedAt: string;
  prices: Prices;
};

