import { useEffect, useRef, useState } from 'react';
import { getStationPriceHistory } from '../services/gasStations.service';
import type { PriceHistoryEntry } from '../types/gasStation';

type Status = 'idle' | 'loading' | 'ready' | 'error';

/**
 * @param enabled — Si es false, no pide el historial (p. ej. acordeón cerrado).
 */
export function useStationPriceHistory(stationId: string | null, enabled: boolean) {
  const [entries, setEntries] = useState<PriceHistoryEntry[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const loadedStationIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadedStationIdRef.current = null;
    if (!stationId) {
      setEntries([]);
      setStatus('idle');
      setError(null);
      return;
    }
    setEntries([]);
    setStatus('idle');
    setError(null);
  }, [stationId]);

  useEffect(() => {
    if (!stationId || !enabled) return;
    if (loadedStationIdRef.current === stationId) return;

    let cancelled = false;
    setStatus('loading');
    setError(null);

    getStationPriceHistory(stationId)
      .then((data) => {
        if (cancelled) return;
        setEntries(data);
        setStatus('ready');
        loadedStationIdRef.current = stationId;
      })
      .catch((e) => {
        if (cancelled) return;
        setEntries([]);
        setStatus('error');
        setError(e instanceof Error ? e.message : 'No se pudo cargar el historial');
      });

    return () => {
      cancelled = true;
    };
  }, [stationId, enabled]);

  return { entries, status, error };
}
