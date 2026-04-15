import { useCallback, useEffect, useMemo, useRef } from "react";
import { getGasStations } from "../services/gasStations.service";
import { useGasStationsStore, type LatLng } from "../store/useGasStationsStore";
import { gasStationCorePrice } from "../types/gasStation";

const DEFAULT_LIMIT = 140;
// El dataset mock cubre Cali y alrededores, pero el filtro por radio era muy estricto (8km),
// lo que puede dejar el mapa vacío si el centro actual cae ligeramente fuera.
const DEFAULT_RADIUS_KM = 25;

export function useStationsQuery() {
  const searchCenter = useGasStationsStore((s) => s.searchCenter);
  const filters = useGasStationsStore((s) => s.filters);
  const editedPricesById = useGasStationsStore((s) => s.editedPricesById);

  const stations = useGasStationsStore((s) => s.stations);
  const stationsStatus = useGasStationsStore((s) => s.stationsStatus);
  const stationsError = useGasStationsStore((s) => s.stationsError);

  const setStationsStatus = useGasStationsStore((s) => s.setStationsStatus);
  const setStations = useGasStationsStore((s) => s.setStations);

  const applyEditedPrices = useCallback(
    (baseStations: typeof stations) => {
      if (!editedPricesById || Object.keys(editedPricesById).length === 0) return baseStations;

      return baseStations.map((st) => {
        const edited = editedPricesById[st.id];
        if (!edited) return st;
        return {
          ...st,
          current_corriente: edited.corriente,
          current_premium: edited.premium,
          current_diesel: edited.diesel,
        };
      });
    },
    [editedPricesById],
  );

  const requestIdRef = useRef(0);

  const runQuery = useCallback(
    async (center: LatLng) => {
      const requestId = ++requestIdRef.current;

      setStationsStatus("loading");
      try {
        const results = await getGasStations({
          lat: center.lat,
          lng: center.lng,
          radius: DEFAULT_RADIUS_KM,
          limit: DEFAULT_LIMIT,
        });

        // Aplicar modificaciones en memoria (sin persistencia real).
        const withEdits = applyEditedPrices(results);

        // Evitar condición de carrera.
        if (requestId !== requestIdRef.current) return;
        setStations(withEdits);
      } catch (e) {
        if (requestId !== requestIdRef.current) return;
        setStationsStatus("error", e instanceof Error ? e.message : "Error al cargar estaciones");
      }
    },
    [applyEditedPrices, setStations, setStationsStatus],
  );

  useEffect(() => {
    if (!searchCenter) return;
    runQuery(searchCenter);
  }, [searchCenter?.lat, searchCenter?.lng, runQuery]);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const selectedFuelType = filters.fuelType ?? "corriente";
      const selectedPrice = gasStationCorePrice(station, selectedFuelType);

      if (
        filters.minPrice !== undefined &&
        selectedPrice !== undefined &&
        selectedPrice < filters.minPrice
      )
        return false;
      if (
        filters.maxPrice !== undefined &&
        selectedPrice !== undefined &&
        selectedPrice > filters.maxPrice
      )
        return false;
      return true;
    });
  }, [filters.fuelType, filters.maxPrice, filters.minPrice, stations]);

  return {
    stations: filteredStations,
    stationsStatus,
    stationsError,
    refetch: () => {
      if (!searchCenter) return;
      runQuery(searchCenter);
    },
  };
}
