import { gasStationsMock } from '../mock/gasStations';
import type { FuelType, GasStation, GetGasStationsParams } from '../types/gasStation';
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

export async function getGasStations(
  params: GetGasStationsParams,
): Promise<GasStation[]> {
  // 1) Simular latencia tipo backend real.
  await delay(randomInt(500, 1000));

  const radiusKm = params.radius ?? 8; // 5–10 km por defecto
  const limit = Math.min(params.limit ?? 120, 150);
  const fuelType = params.fuelType;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;

  const lat = params.lat;
  const lng = params.lng;

  // 2–3) Procesar datos como backend:
  // - calcular distancia (Haversine)
  // - filtrar por radio
  // - filtrar por tipo (aplicado al precio para rango min/max)
  // - filtrar por rango de precios
  // - ordenar por distancia
  // - limitar resultados
  const results = gasStationsMock
    .map((station) => {
      const distanceKm = haversineDistanceKm(
        lat,
        lng,
        station.latitude,
        station.longitude,
      );
      return { ...station, distanceKm };
    })
    .filter((station) => station.distanceKm !== undefined && station.distanceKm <= radiusKm)
    .filter((station) => {
      if (minPrice === undefined && maxPrice === undefined) return true;

      // Si no hay fuelType seleccionado, asumimos 'corriente' para aplicar rango.
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

