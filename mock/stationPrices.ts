import type { StationPriceRow } from '../types/gasStation';

/** Mock tabla `station_prices`. */
export const stationPricesMock: StationPriceRow[] = [
  { id: 'pr010', stationId: '00000001-0000-4000-8000-000000000001', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 12000, extra: 13200, diesel: 10100 } },
  { id: 'pr011', stationId: '00000001-0000-4000-8000-000000000001', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 11950, extra: 13150, diesel: 10050 } },
  { id: 'pr012', stationId: '00000001-0000-4000-8000-000000000001', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 11900, extra: 13100, diesel: 10000 } },

  { id: 'pr020', stationId: '00000002-0000-4000-8000-000000000002', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 12100, extra: 13300, diesel: 10200 } },
  { id: 'pr021', stationId: '00000002-0000-4000-8000-000000000002', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 12050, extra: 13250, diesel: 10150 } },
  { id: 'pr022', stationId: '00000002-0000-4000-8000-000000000002', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 12000, extra: 13200, diesel: 10100 } },

  { id: 'pr030', stationId: '00000003-0000-4000-8000-000000000003', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 11800, extra: 13000, diesel: 9900 } },
  { id: 'pr031', stationId: '00000003-0000-4000-8000-000000000003', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 11750, extra: 12950, diesel: 9850 } },
  { id: 'pr032', stationId: '00000003-0000-4000-8000-000000000003', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 11700, extra: 12900, diesel: 9800 } },

  { id: 'pr040', stationId: '00000004-0000-4000-8000-000000000004', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 12200, extra: 13400, diesel: 10300 } },
  { id: 'pr041', stationId: '00000004-0000-4000-8000-000000000004', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 12150, extra: 13350, diesel: 10250 } },
  { id: 'pr042', stationId: '00000004-0000-4000-8000-000000000004', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 12100, extra: 13300, diesel: 10200 } },

  { id: 'pr050', stationId: '00000005-0000-4000-8000-000000000005', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 11900, extra: 13100, diesel: 10000 } },
  { id: 'pr051', stationId: '00000005-0000-4000-8000-000000000005', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 11850, extra: 13050, diesel: 9950 } },
  { id: 'pr052', stationId: '00000005-0000-4000-8000-000000000005', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 11800, extra: 13000, diesel: 9900 } },

  { id: 'pr060', stationId: '00000006-0000-4000-8000-000000000006', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 12300, extra: 13500, diesel: 10400 } },
  { id: 'pr061', stationId: '00000006-0000-4000-8000-000000000006', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 12250, extra: 13450, diesel: 10350 } },
  { id: 'pr062', stationId: '00000006-0000-4000-8000-000000000006', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 12200, extra: 13400, diesel: 10300 } },

  { id: 'pr070', stationId: '00000007-0000-4000-8000-000000000007', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 11700, extra: 12900, diesel: 9800 } },
  { id: 'pr071', stationId: '00000007-0000-4000-8000-000000000007', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 11650, extra: 12850, diesel: 9750 } },
  { id: 'pr072', stationId: '00000007-0000-4000-8000-000000000007', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 11600, extra: 12800, diesel: 9700 } },

  { id: 'pr080', stationId: '00000008-0000-4000-8000-000000000008', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 12050, extra: 13250, diesel: 10150 } },
  { id: 'pr081', stationId: '00000008-0000-4000-8000-000000000008', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 12000, extra: 13200, diesel: 10100 } },
  { id: 'pr082', stationId: '00000008-0000-4000-8000-000000000008', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 11950, extra: 13150, diesel: 10050 } },

  { id: 'pr090', stationId: '00000009-0000-4000-8000-000000000009', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 12150, extra: 13350, diesel: 10250 } },
  { id: 'pr091', stationId: '00000009-0000-4000-8000-000000000009', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 12100, extra: 13300, diesel: 10200 } },
  { id: 'pr092', stationId: '00000009-0000-4000-8000-000000000009', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 12050, extra: 13250, diesel: 10150 } },

  { id: 'pr0a0', stationId: '0000000a-0000-4000-8000-00000000000a', recordedAt: '2026-03-24T08:00:00.000Z', prices: { corriente: 11850, extra: 13050, diesel: 9950 } },
  { id: 'pr0a1', stationId: '0000000a-0000-4000-8000-00000000000a', recordedAt: '2026-03-17T08:00:00.000Z', prices: { corriente: 11800, extra: 13000, diesel: 9900 } },
  { id: 'pr0a2', stationId: '0000000a-0000-4000-8000-00000000000a', recordedAt: '2026-03-10T08:00:00.000Z', prices: { corriente: 11750, extra: 12950, diesel: 9850 } },
];
