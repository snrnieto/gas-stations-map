import type { StationPriceSnapshotRow } from '../types/gasStation';

/** Mock tabla de snapshots de historial (`prices_json` = todos los precios en ese instante). */
export const stationPriceSnapshotsMock: StationPriceSnapshotRow[] = [
  { id: 'pr010', station_id: '00000001-0000-4000-8000-000000000001', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 12000, premium: 13200, diesel: 10100, gas: 8900 } },
  { id: 'pr011', station_id: '00000001-0000-4000-8000-000000000001', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 11950, premium: 13150, diesel: 10050, gas: 8850 } },
  { id: 'pr012', station_id: '00000001-0000-4000-8000-000000000001', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 11900, premium: 13100, diesel: 10000 } },

  { id: 'pr020', station_id: '00000002-0000-4000-8000-000000000002', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 12100, premium: 13300, diesel: 10200, electrico: 950, taxi: 14000 } },
  { id: 'pr021', station_id: '00000002-0000-4000-8000-000000000002', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 12050, premium: 13250, diesel: 10150, electrico: 940, taxi: 13900 } },
  { id: 'pr022', station_id: '00000002-0000-4000-8000-000000000002', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 12000, premium: 13200, diesel: 10100 } },

  { id: 'pr030', station_id: '00000003-0000-4000-8000-000000000003', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 11800, premium: 13000, diesel: 9900 } },
  { id: 'pr031', station_id: '00000003-0000-4000-8000-000000000003', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 11750, premium: 12950, diesel: 9850 } },
  { id: 'pr032', station_id: '00000003-0000-4000-8000-000000000003', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 11700, premium: 12900, diesel: 9800 } },

  { id: 'pr040', station_id: '00000004-0000-4000-8000-000000000004', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 12200, premium: 13400, diesel: 10300 } },
  { id: 'pr041', station_id: '00000004-0000-4000-8000-000000000004', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 12150, premium: 13350, diesel: 10250 } },
  { id: 'pr042', station_id: '00000004-0000-4000-8000-000000000004', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 12100, premium: 13300, diesel: 10200 } },

  { id: 'pr050', station_id: '00000005-0000-4000-8000-000000000005', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 11900, premium: 13100, diesel: 10000 } },
  { id: 'pr051', station_id: '00000005-0000-4000-8000-000000000005', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 11850, premium: 13050, diesel: 9950 } },
  { id: 'pr052', station_id: '00000005-0000-4000-8000-000000000005', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 11800, premium: 13000, diesel: 9900 } },

  { id: 'pr060', station_id: '00000006-0000-4000-8000-000000000006', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 12300, premium: 13500, diesel: 10400 } },
  { id: 'pr061', station_id: '00000006-0000-4000-8000-000000000006', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 12250, premium: 13450, diesel: 10350 } },
  { id: 'pr062', station_id: '00000006-0000-4000-8000-000000000006', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 12200, premium: 13400, diesel: 10300 } },

  { id: 'pr070', station_id: '00000007-0000-4000-8000-000000000007', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 11700, premium: 12900, diesel: 9800 } },
  { id: 'pr071', station_id: '00000007-0000-4000-8000-000000000007', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 11650, premium: 12850, diesel: 9750 } },
  { id: 'pr072', station_id: '00000007-0000-4000-8000-000000000007', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 11600, premium: 12800, diesel: 9700 } },

  { id: 'pr080', station_id: '00000008-0000-4000-8000-000000000008', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 12050, premium: 13250, diesel: 10150 } },
  { id: 'pr081', station_id: '00000008-0000-4000-8000-000000000008', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 12000, premium: 13200, diesel: 10100 } },
  { id: 'pr082', station_id: '00000008-0000-4000-8000-000000000008', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 11950, premium: 13150, diesel: 10050 } },

  { id: 'pr090', station_id: '00000009-0000-4000-8000-000000000009', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 12150, premium: 13350, diesel: 10250 } },
  { id: 'pr091', station_id: '00000009-0000-4000-8000-000000000009', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 12100, premium: 13300, diesel: 10200 } },
  { id: 'pr092', station_id: '00000009-0000-4000-8000-000000000009', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 12050, premium: 13250, diesel: 10150 } },

  { id: 'pr0a0', station_id: '0000000a-0000-4000-8000-00000000000a', created_at: '2026-03-24T08:00:00.000Z', prices_json: { corriente: 11850, premium: 13050, diesel: 9950 } },
  { id: 'pr0a1', station_id: '0000000a-0000-4000-8000-00000000000a', created_at: '2026-03-17T08:00:00.000Z', prices_json: { corriente: 11800, premium: 13000, diesel: 9900 } },
  { id: 'pr0a2', station_id: '0000000a-0000-4000-8000-00000000000a', created_at: '2026-03-10T08:00:00.000Z', prices_json: { corriente: 11750, premium: 12950, diesel: 9850 } },
];
