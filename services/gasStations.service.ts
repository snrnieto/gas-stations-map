import { stationsMock, pricesFromSeed } from '../mock/gasStations';
import {
  getPriceHistoryForStation,
  latestPriceByStationId,
} from '../mock/stationPrices';
import type {
  FuelType,
  GasStation,
  GetGasStationsParams,
  PriceHistoryEntry,
  Prices,
  StationRow,
} from '../types/gasStation';
import { haversineDistanceKm } from '../utils/haversine';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

function getPriceForFuelType(station: GasStation, fuelType: FuelType): number {
  return station.prices[fuelType];
}

/**
 * Une fila de estación + último snapshot de precios (simula una sola respuesta tipo vista/RPC en Supabase).
 */
function stationRowToGasStation(row: StationRow, latestById: Map<string, Prices>): GasStation {
  const prices = latestById.get(row.id) ?? pricesFromSeed(row.id);
  return {
    ...row,
    prices: { ...prices },
  };
}

export async function getGasStations(
  params: GetGasStationsParams,
): Promise<GasStation[]> {
  await delay(randomInt(500, 1000));

  const radiusKm = params.radius ?? 8;
  const limit = Math.min(params.limit ?? 120, 150);
  const fuelType = params.fuelType;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;

  const lat = params.lat;
  const lng = params.lng;

  const results = stationsMock
    .map((station) => {
      const distanceKm = haversineDistanceKm(
        lat,
        lng,
        station.latitude,
        station.longitude,
      );
      const withPrices = stationRowToGasStation(station, latestPriceByStationId);
      return { ...withPrices, distanceKm };
    })
    .filter((station) => station.distanceKm !== undefined && station.distanceKm <= radiusKm)
    .filter((station) => {
      if (minPrice === undefined && maxPrice === undefined) return true;

      const selectedFuelType: FuelType = fuelType ?? 'corriente';
      const selectedPrice = getPriceForFuelType(station, selectedFuelType);

      if (minPrice !== undefined && selectedPrice < minPrice) return false;
      if (maxPrice !== undefined && selectedPrice > maxPrice) return false;
      return true;
    })
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, limit);

  return results;
}

/**
 * Simula GET /stations/:id/price-history — misma fuente que `stationPricesMock`.
 */
export async function getStationPriceHistory(stationId: string): Promise<PriceHistoryEntry[]> {
  await delay(randomInt(350, 800));

  return getPriceHistoryForStation(stationId).map((e) => ({
    recordedAt: e.recordedAt,
    prices: { ...e.prices },
  }));
}
