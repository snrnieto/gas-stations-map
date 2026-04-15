import { CORE_PRICE_KEYS } from "../types/gasStation";

export function formatDistanceKm(distanceKm: number): string {
  if (!Number.isFinite(distanceKm)) return '--';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}

export function formatHistoryDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatCop(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return '--';
  const rounded = Math.round(value);

  // Intl es soportado en la mayoría de entornos RN modernos; fallback si falla.
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(rounded);
  } catch {
    return `${rounded.toLocaleString('es-CO')} COP`;
  }
}

const FUEL_LABELS: Record<string, string> = {
  corriente: "Corriente",
  premium: "Premium",
  diesel: "Diesel",
  electrico: "Eléctrico",
  taxi: "Taxi",
  gas: "Gas",
};

export function fuelDisplayLabel(key: string): string {
  return FUEL_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

/** Resume un `prices_json` para el historial: primero corriente/premium/diesel, luego el resto ordenado. */
export function formatPricesJsonSummary(prices: Record<string, number>): string {
  const keys = Object.keys(prices);
  const coreSet = new Set<string>(CORE_PRICE_KEYS);
  const coreOrdered = CORE_PRICE_KEYS.filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !coreSet.has(k)).sort();
  const ordered = [...coreOrdered, ...rest];
  return ordered.map((k) => `${fuelDisplayLabel(k)} ${formatCop(prices[k]!)}`).join(" · ");
}
