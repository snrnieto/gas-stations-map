import type { PriceHistoryEntry, Prices, StationPriceRow } from "../types/gasStation";
import { hashId, pricesFromSeed, stationsMock } from "./gasStations";

const HISTORY_WEEKS = 10;
const BASE_RECORDED_AT_UTC = Date.UTC(2026, 2, 24, 8, 0, 0);

function mix32(n: number): number {
  let x = n | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  return Math.abs(x | 0);
}

function buildWeeklyPriceRowsForStation(stationId: string, anchor: Prices): StationPriceRow[] {
  let corriente = anchor.corriente;
  let extra = anchor.extra;
  let diesel = anchor.diesel;
  const rows: StationPriceRow[] = [];

  for (let w = 0; w < HISTORY_WEEKS; w++) {
    const recordedAt = new Date(BASE_RECORDED_AT_UTC - w * 7 * 24 * 60 * 60 * 1000).toISOString();
    rows.push({
      id: `${stationId}-w${w}`,
      stationId,
      recordedAt,
      prices: { corriente, extra, diesel },
    });

    if (w < HISTORY_WEEKS - 1) {
      const hc = mix32(hashId(`${stationId}|hist|${w}|c`));
      const he = mix32(hashId(`${stationId}|hist|${w}|e`));
      const hd = mix32(hashId(`${stationId}|hist|${w}|d`));
      corriente -= 15 + (hc % 90);
      extra -= 15 + (he % 90);
      diesel -= 12 + (hd % 75);
    }
  }

  return rows;
}

/**
 * Tabla simulada `station_prices`: varias filas por estación (misma lógica que el historial anterior).
 */
export const stationPricesMock: StationPriceRow[] = stationsMock.flatMap((s) =>
  buildWeeklyPriceRowsForStation(s.id, pricesFromSeed(s.id)),
);

export function buildLatestPriceByStationId(rows: StationPriceRow[]): Map<string, Prices> {
  const best = new Map<string, { t: number; prices: Prices }>();

  for (const r of rows) {
    const t = Date.parse(r.recordedAt);
    if (Number.isNaN(t)) continue;
    const prev = best.get(r.stationId);
    if (!prev || t > prev.t) {
      best.set(r.stationId, {
        t,
        prices: { ...r.prices },
      });
    }
  }

  return new Map([...best.entries()].map(([stationId, v]) => [stationId, v.prices]));
}

/** Último precio por estación (simula join / vista en Supabase). */
export const latestPriceByStationId: Map<string, Prices> = buildLatestPriceByStationId(stationPricesMock);

/**
 * Historial para detalle: mismas filas que la tabla mock; ids desconocidos generan serie sintética.
 */
export function getPriceHistoryForStation(stationId: string): PriceHistoryEntry[] {
  const fromTable = stationPricesMock
    .filter((r) => r.stationId === stationId)
    .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt));

  if (fromTable.length > 0) {
    return fromTable.map((r) => ({
      recordedAt: r.recordedAt,
      prices: { ...r.prices },
    }));
  }

  const synthetic = buildWeeklyPriceRowsForStation(stationId, pricesFromSeed(stationId));
  return synthetic.map((r) => ({
    recordedAt: r.recordedAt,
    prices: { ...r.prices },
  }));
}
