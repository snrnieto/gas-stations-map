import type { GasStation } from '../types/gasStation';

/** Mock de estaciones: mismo modelo que `GasStation`; `distance` la calcula la consulta cercana. */
export const stationsMock: Omit<GasStation, 'distance'>[] = [
  { id: '00000001-0000-4000-8000-000000000001', name: 'S01', business_name: 'B01', address: 'Cra. 1 #10-20, Cali', lat: 3.451, lng: -76.521, current_corriente: 12000, current_premium: 13200, current_diesel: 10100, current_prices_extra: { gas: 8900 } },
  { id: '00000002-0000-4000-8000-000000000002', name: 'S02', business_name: 'B02', address: 'Av. 6N #15-40, Cali', lat: 3.442, lng: -76.515, current_corriente: 12100, current_premium: 13300, current_diesel: 10200, current_prices_extra: { electrico: 950, taxi: 14000 } },
  { id: '00000003-0000-4000-8000-000000000003', name: 'S03', business_name: 'B01', address: 'Cll. 5 #20-10, Cali', lat: 3.438, lng: -76.528, current_corriente: 11800, current_premium: 13000, current_diesel: 9900, current_prices_extra: {} },
  { id: '00000004-0000-4000-8000-000000000004', name: 'S04', business_name: 'B03', address: 'Av. Las Américas #50-30', lat: 3.46, lng: -76.505, current_corriente: 12200, current_premium: 13400, current_diesel: 10300, current_prices_extra: {} },
  { id: '00000005-0000-4000-8000-000000000005', name: 'S05', business_name: 'B02', address: 'Cra. 8 #12-00, Cali', lat: 3.4, lng: -76.54, current_corriente: 11900, current_premium: 13100, current_diesel: 10000, current_prices_extra: {} },
  { id: '00000006-0000-4000-8000-000000000006', name: 'S06', business_name: 'B01', address: 'Cll. 9 #30-15, Cali', lat: 3.48, lng: -76.53, current_corriente: 12300, current_premium: 13500, current_diesel: 10400, current_prices_extra: {} },
  { id: '00000007-0000-4000-8000-000000000007', name: 'S07', business_name: 'B03', address: 'Av. Roosevelt #25-8', lat: 3.42, lng: -76.51, current_corriente: 11700, current_premium: 12900, current_diesel: 9800, current_prices_extra: {} },
  { id: '00000008-0000-4000-8000-000000000008', name: 'S08', business_name: 'B02', address: 'Cra. 15 #44-22, Cali', lat: 3.435, lng: -76.545, current_corriente: 12050, current_premium: 13250, current_diesel: 10150, current_prices_extra: {} },
  { id: '00000009-0000-4000-8000-000000000009', name: 'S09', business_name: 'B01', address: 'Cll. 14 #35-90, Cali', lat: 3.465, lng: -76.518, current_corriente: 12150, current_premium: 13350, current_diesel: 10250, current_prices_extra: {} },
  { id: '0000000a-0000-4000-8000-00000000000a', name: 'S10', business_name: 'B03', address: 'Av. 9N #18-55, Cali', lat: 3.405, lng: -76.525, current_corriente: 11850, current_premium: 13050, current_diesel: 9950, current_prices_extra: {} },
];
