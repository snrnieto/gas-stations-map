import type { GasStation, PriceHistoryEntry, Prices, StationPriceRow, StationRow } from '../types/gasStation';
import { haversineDistanceKm } from '../utils/haversine';
import { stationsMock } from './gasStations';
import { stationPricesMock } from './stationPrices';

/** Parámetros típicos de una RPC `nearby_stations` / consulta con PostGIS en Supabase. */
export type MockNearbyStationsParams = {
  lat: number;
  lng: number;
  radiusKm: number;
  /** Máximo de filas que devuelve la consulta (ORDER BY distancia LIMIT n). */
  rowLimit: number;
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

const missingPrices: Prices = { corriente: 0, extra: 0, diesel: 0 };

/**
 * Solo precios de los `station_id` que van a unirse (como `WHERE sp.station_id IN (…)` o seeks del LATERAL).
 * En producción Postgres no envía ni materializa toda `station_prices`: el LATERAL + índice `(station_id, recorded_at DESC)`
 * toca pocas filas por estación. Aquí el fixture es un array plano: se recorre una vez pero solo se agrupan filas de esos ids.
 */
function groupStationPricesForStationIds(stationIds: Set<string>): Map<string, StationPriceRow[]> {
  const m = new Map<string, StationPriceRow[]>();
  for (const r of stationPricesMock) {
    if (!stationIds.has(r.stationId)) continue;
    const list = m.get(r.stationId);
    if (list) list.push(r);
    else m.set(r.stationId, [r]);
  }
  return m;
}

/**
 * Simula:
 * JOIN LATERAL (
 *   SELECT prices FROM station_prices sp
 *   WHERE sp.station_id = s.id
 *   ORDER BY sp.recorded_at DESC
 *   LIMIT 1
 * ) latest ON true
 */
function lateralLatestPrices(
  stationId: string,
  pricesByStationId: Map<string, StationPriceRow[]>,
): Prices {
  const rows = pricesByStationId.get(stationId);
  if (!rows?.length) return missingPrices;

  let best = rows[0];
  let bestT = Date.parse(best.recordedAt);
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const t = Date.parse(r.recordedAt);
    if (!Number.isNaN(t) && t > bestT) {
      best = r;
      bestT = t;
    }
  }
  return { ...best.prices };
}

function stationRowWithPrices(row: StationRow, prices: Prices): GasStation {
  return {
    ...row,
    prices: { ...prices },
  };
}

/**
 * Simula una sola consulta SQL (o RPC) en Postgres/Supabase, equivalente a:
 *
 * SELECT s.*, latest.prices,
 *        ST_Distance(s.geom, ST_MakePoint(:lng, :lat)::geography) AS distance_km
 * FROM stations s
 * JOIN LATERAL (
 *   SELECT sp.prices
 *   FROM station_prices sp
 *   WHERE sp.station_id = s.id
 *   ORDER BY sp.recorded_at DESC
 *   LIMIT 1
 * ) latest ON true
 * WHERE ST_DWithin(s.geom, ST_MakePoint(:lng, :lat)::geography, :radius_km * 1000)
 * ORDER BY distance_km
 * LIMIT :row_limit;
 *
 * (Nombres de columnas/PostGIS según tu esquema; aquí la distancia se aproxima con Haversine en TS.)
 */
export async function mockFetchNearbyGasStationsWithPrices(
  p: MockNearbyStationsParams,
): Promise<GasStation[]> {
  await delay(randomInt(500, 1000));

  const narrowed = stationsMock
    .map((row) => ({
      row,
      distanceKm: haversineDistanceKm(p.lat, p.lng, row.latitude, row.longitude),
    }))
    .filter((x) => x.distanceKm !== undefined && x.distanceKm <= p.radiusKm)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, p.rowLimit);

  const stationIds = new Set(narrowed.map((x) => x.row.id));
  const pricesByStationId = groupStationPricesForStationIds(stationIds);

  return narrowed.map(({ row, distanceKm }) => ({
    ...stationRowWithPrices(row, lateralLatestPrices(row.id, pricesByStationId)),
    distanceKm,
  }));
}

/** Simula `station_prices` filtrado por `station_id` y ordenado por `recorded_at` (Supabase). */
export async function mockGetStationPriceHistory(stationId: string): Promise<PriceHistoryEntry[]> {
  await delay(randomInt(350, 800));

  const rows = stationPricesMock
    .filter((r) => r.stationId === stationId)
    .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt));

  return rows.map((r) => ({
    recordedAt: r.recordedAt,
    prices: { ...r.prices },
  }));
}
