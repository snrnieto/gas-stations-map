import type { StationRow } from '../types/gasStation';

/** Mock tabla `stations` — valores literales como filas de DB. */
export const stationsMock: StationRow[] = [
  { id: '00000001-0000-4000-8000-000000000001', name: 'S01', businessName: 'B01', address: 'A01', latitude: 3.451, longitude: -76.521 },
  { id: '00000002-0000-4000-8000-000000000002', name: 'S02', businessName: 'B02', address: 'A02', latitude: 3.442, longitude: -76.515 },
  { id: '00000003-0000-4000-8000-000000000003', name: 'S03', businessName: 'B01', address: 'A03', latitude: 3.438, longitude: -76.528 },
  { id: '00000004-0000-4000-8000-000000000004', name: 'S04', businessName: 'B03', address: 'A04', latitude: 3.46, longitude: -76.505 },
  { id: '00000005-0000-4000-8000-000000000005', name: 'S05', businessName: 'B02', address: 'A05', latitude: 3.4, longitude: -76.54 },
  { id: '00000006-0000-4000-8000-000000000006', name: 'S06', businessName: 'B01', address: 'A06', latitude: 3.48, longitude: -76.53 },
  { id: '00000007-0000-4000-8000-000000000007', name: 'S07', businessName: 'B03', address: 'A07', latitude: 3.42, longitude: -76.51 },
  { id: '00000008-0000-4000-8000-000000000008', name: 'S08', businessName: 'B02', address: 'A08', latitude: 3.435, longitude: -76.545 },
  { id: '00000009-0000-4000-8000-000000000009', name: 'S09', businessName: 'B01', address: 'A09', latitude: 3.465, longitude: -76.518 },
  { id: '0000000a-0000-4000-8000-00000000000a', name: 'S10', businessName: 'B03', address: 'A10', latitude: 3.405, longitude: -76.525 },
];
