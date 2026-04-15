import { mockFetchNearbyGasStationsWithPrices, mockGetStationPriceHistory } from '../mock/gasStationsEndpoints';
import {
  type GasStation,
  type GetGasStationsParams,
  gasStationCorePrice,
  type PriceHistoryEntry,
} from '../types/gasStation';

/**
 * Pide candidatas cercanas a Supabase (mock) y aplica filtros de precio y tope final en la app.
 * `rowLimit` en la consulta es el máximo de filas espaciales; el slice final respeta `params.limit`.
 */
export async function getGasStations(params: GetGasStationsParams): Promise<GasStation[]> {
  const radiusKm = params.radius ?? 8;
  const limit = Math.min(params.limit ?? 120, 150);
  const fuelType = params.fuelType;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;

  const nearby = await mockFetchNearbyGasStationsWithPrices({
    lat: params.lat,
    lng: params.lng,
    radiusKm,
    rowLimit: 150,
  });

  return nearby
    .filter((station) => {
      if (minPrice === undefined && maxPrice === undefined) return true;

      const selectedFuelType = fuelType ?? 'corriente';
      const selectedPrice = gasStationCorePrice(station, selectedFuelType);

      if (minPrice !== undefined && selectedPrice !== undefined && selectedPrice < minPrice)
        return false;
      if (maxPrice !== undefined && selectedPrice !== undefined && selectedPrice > maxPrice)
        return false;
      return true;
    })
    .slice(0, limit);
}

/** Historial de precios por estación; reemplazar mock por consulta a la tabla de snapshots en Supabase. */
export async function getStationPriceHistory(stationId: string): Promise<PriceHistoryEntry[]> {
  return mockGetStationPriceHistory(stationId);
}
