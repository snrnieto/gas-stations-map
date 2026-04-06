import type { GasStation, PriceHistoryEntry } from "../types/gasStation";
import { haversineDistanceKm } from "../utils/haversine";
import { stationsMock } from "./gasStations";
import { stationPriceSnapshotsMock } from "./stationPrices";

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

/**
 * Simula una sola consulta SQL (o RPC) en Postgres/Supabase, equivalente a:
 *
 * SELECT s.*,
 *        ST_Distance(s.geom, ST_MakePoint(:lng, :lat)::geography) AS distance_m
 * FROM stations s
 * WHERE ST_DWithin(s.geom, ST_MakePoint(:lng, :lat)::geography, :radius_km * 1000)
 * ORDER BY distance_m
 * LIMIT :row_limit;
 *
 * (`address`, `current_corriente`, `current_premium`, `current_diesel`, `current_prices_extra` vienen de columnas en `stations`.)
 *
 * (Nombres de columnas/PostGIS según tu esquema; aquí la distancia se aproxima con Haversine en TS.)
 */
export async function mockFetchNearbyGasStationsWithPrices(p: MockNearbyStationsParams): Promise<GasStation[]> {
  await delay(randomInt(500, 1000));

  return stationsMock
    .map((st) => {
      const distanceMeters = haversineDistanceKm(p.lat, p.lng, st.lat, st.lng) * 1000;
      return { ...st, distance: distanceMeters };
    })
    .filter((st) => st.distance / 1000 <= p.radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, p.rowLimit);
}

/** Simula snapshots de historial filtrados por `station_id` y ordenados por `created_at` DESC (Supabase). */
export async function mockGetStationPriceHistory(stationId: string): Promise<PriceHistoryEntry[]> {
  await delay(randomInt(350, 800));

  return stationPriceSnapshotsMock
    .filter((r) => r.station_id === stationId)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .map((r) => ({
      id: r.id,
      station_id: r.station_id,
      created_at: r.created_at,
      prices_json: { ...r.prices_json },
    }));
}
