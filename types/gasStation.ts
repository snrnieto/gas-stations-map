export type FuelType = "corriente" | "premium" | "diesel";

export type Prices = {
  corriente: number;
  premium: number;
  diesel: number;
};

/**
 * Los tres core pueden faltar por separado (estación sin snapshot, solo algunos combustibles, etc.).
 */
export type CorePriceValues = {
  corriente: number | undefined;
  premium: number | undefined;
  diesel: number | undefined;
};

/** Orden sugerido al mostrar claves dentro de `prices_json`. */
export const CORE_PRICE_KEYS: readonly FuelType[] = ["corriente", "premium", "diesel"];

/**
 * Fila de la tabla de snapshots de historial (p. ej. `station_price_snapshots`), alineada al JSON del backend.
 */
export type StationPriceSnapshotRow = {
  id: string;
  station_id: string;
  prices_json: Record<string, number>;
  created_at: string;
};

/**
 * Respuesta del endpoint cercano (PostGIS / RPC en Supabase), alineada al JSON del backend.
 * `distance`: metros desde el punto de búsqueda (p. ej. ST_Distance con geography).
 */
export type GasStation = {
  id: string;
  name: string;
  business_name: string;
  address: string;
  lat: number;
  lng: number;
  current_corriente?: number;
  current_premium?: number;
  current_diesel?: number;
  current_prices_extra: Record<string, number>;
  distance: number;
};

export function gasStationCorePrice(station: GasStation, fuel: FuelType): number | undefined {
  const raw =
    fuel === "corriente"
      ? station.current_corriente
      : fuel === "premium"
        ? station.current_premium
        : station.current_diesel;
  if (raw === undefined || !Number.isFinite(raw)) return undefined;
  return raw;
}

export function corePricesFromGasStation(station: GasStation): CorePriceValues {
  const pick = (v: number | undefined) =>
    v !== undefined && Number.isFinite(v) ? v : undefined;
  return {
    corriente: pick(station.current_corriente),
    premium: pick(station.current_premium),
    diesel: pick(station.current_diesel),
  };
}

export type GetGasStationsParams = {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  fuelType?: FuelType;
  minPrice?: number;
  maxPrice?: number;
};

/** Un registro del historial de precios (misma forma que un elemento del array del API). */
export type PriceHistoryEntry = {
  id: string;
  station_id: string;
  created_at: string;
  prices_json: Record<string, number>;
};
