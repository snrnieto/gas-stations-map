export type FuelType = 'corriente' | 'extra' | 'diesel';

export type Prices = {
  corriente: number;
  extra: number;
  diesel: number;
};

export type GasStation = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  prices: Prices;
  businessName?: string;
  /**
   * Distancia calculada en el servicio (km) desde la ubicación solicitada.
   * Usada principalmente para ordenar y mostrar en vista lista.
   */
  distanceKm?: number;
};

export type GetGasStationsParams = {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  fuelType?: FuelType;
  minPrice?: number;
  maxPrice?: number;
};

