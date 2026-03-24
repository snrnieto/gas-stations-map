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

export function formatCop(value: number): string {
  if (!Number.isFinite(value)) return '--';
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

