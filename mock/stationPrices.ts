import type { StationPriceSnapshotRow } from "../types/gasStation";

/** Mock tabla de snapshots de historial (`prices_json` = todos los precios en ese instante). */
export const stationPriceSnapshotsMock: StationPriceSnapshotRow[] = [
  {
    id: "pr010",
    station_id: "00000001-0000-4000-8000-000000000001",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 13690, premium: 15020, diesel: 12140, gas: 9180 },
  },
  {
    id: "pr011",
    station_id: "00000001-0000-4000-8000-000000000001",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 13640, premium: 14970, diesel: 12090, gas: 9120 },
  },
  {
    id: "pr012",
    station_id: "00000001-0000-4000-8000-000000000001",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 13590, premium: 14920, diesel: 12040, gas: 9050 },
  },

  {
    id: "pr020",
    station_id: "00000002-0000-4000-8000-000000000002",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: {
      corriente: 13950,
      premium: 15380,
      diesel: 12420,
      electrico: 920,
      taxi: 14200,
    },
  },
  {
    id: "pr021",
    station_id: "00000002-0000-4000-8000-000000000002",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: {
      corriente: 13900,
      premium: 15330,
      diesel: 12370,
      electrico: 910,
      taxi: 14150,
    },
  },
  {
    id: "pr022",
    station_id: "00000002-0000-4000-8000-000000000002",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 13850, premium: 15280, diesel: 12320 },
  },

  {
    id: "pr030",
    station_id: "00000003-0000-4000-8000-000000000003",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 12980, premium: 14290, diesel: 11560 },
  },
  {
    id: "pr031",
    station_id: "00000003-0000-4000-8000-000000000003",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 12930, premium: 14240, diesel: 11510 },
  },
  {
    id: "pr032",
    station_id: "00000003-0000-4000-8000-000000000003",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 12880, premium: 14190, diesel: 11460 },
  },

  {
    id: "pr040",
    station_id: "00000004-0000-4000-8000-000000000004",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 14120, premium: 15540, diesel: 12680 },
  },
  {
    id: "pr041",
    station_id: "00000004-0000-4000-8000-000000000004",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 14070, premium: 15490, diesel: 12630 },
  },
  {
    id: "pr042",
    station_id: "00000004-0000-4000-8000-000000000004",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 14020, premium: 15440, diesel: 12580 },
  },

  {
    id: "pr050",
    station_id: "00000005-0000-4000-8000-000000000005",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 13140, premium: 14460, diesel: 11910 },
  },
  {
    id: "pr051",
    station_id: "00000005-0000-4000-8000-000000000005",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 13090, premium: 14410, diesel: 11860 },
  },
  {
    id: "pr052",
    station_id: "00000005-0000-4000-8000-000000000005",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 13040, premium: 14360, diesel: 11810 },
  },

  {
    id: "pr060",
    station_id: "00000006-0000-4000-8000-000000000006",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 13880, premium: 15290, diesel: 12350 },
  },
  {
    id: "pr061",
    station_id: "00000006-0000-4000-8000-000000000006",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 13830, premium: 15240, diesel: 12300 },
  },
  {
    id: "pr062",
    station_id: "00000006-0000-4000-8000-000000000006",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 13780, premium: 15190, diesel: 12250 },
  },

  {
    id: "pr070",
    station_id: "00000007-0000-4000-8000-000000000007",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 12750, premium: 14080, diesel: 11390 },
  },
  {
    id: "pr071",
    station_id: "00000007-0000-4000-8000-000000000007",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 12700, premium: 14030, diesel: 11340 },
  },
  {
    id: "pr072",
    station_id: "00000007-0000-4000-8000-000000000007",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 12650, premium: 13980, diesel: 11290 },
  },

  {
    id: "pr080",
    station_id: "00000008-0000-4000-8000-000000000008",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 13420, premium: 14780, diesel: 12050 },
  },
  {
    id: "pr081",
    station_id: "00000008-0000-4000-8000-000000000008",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 13370, premium: 14730, diesel: 12000 },
  },
  {
    id: "pr082",
    station_id: "00000008-0000-4000-8000-000000000008",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 13320, premium: 14680, diesel: 11950 },
  },

  {
    id: "pr090",
    station_id: "00000009-0000-4000-8000-000000000009",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 13290, premium: 14620, diesel: 11880 },
  },
  {
    id: "pr091",
    station_id: "00000009-0000-4000-8000-000000000009",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 13240, premium: 14570, diesel: 11830 },
  },
  {
    id: "pr092",
    station_id: "00000009-0000-4000-8000-000000000009",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 13190, premium: 14520, diesel: 11780 },
  },

  {
    id: "pr0a0",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-03-24T08:00:00.000Z",
    prices_json: { corriente: 13020, premium: 14350, diesel: 11740 },
  },
  {
    id: "pr0a1",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-03-17T08:00:00.000Z",
    prices_json: { corriente: 12970, premium: 14300, diesel: 11690 },
  },
  {
    id: "pr0a2",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-03-10T08:00:00.000Z",
    prices_json: { corriente: 12920, premium: 14250, diesel: 11640 },
  },
  {
    id: "pr0a3",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-03-03T08:00:00.000Z",
    prices_json: { corriente: 12870, premium: 14200, diesel: 11590 },
  },
  {
    id: "pr0a4",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-02-24T08:00:00.000Z",
    prices_json: { corriente: 12820, premium: 14150, diesel: 11540 },
  },
  {
    id: "pr0a5",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-02-17T08:00:00.000Z",
    prices_json: { corriente: 12770, premium: 14100, diesel: 11490 },
  },
  {
    id: "pr0a6",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-02-10T08:00:00.000Z",
    prices_json: { corriente: 12720, premium: 14050, diesel: 11440 },
  },
  {
    id: "pr0a7",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-02-03T08:00:00.000Z",
    prices_json: { corriente: 12670, premium: 14000, diesel: 11390 },
  },
  {
    id: "pr0a8",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-01-27T08:00:00.000Z",
    prices_json: { corriente: 12620, premium: 13950, diesel: 11340 },
  },
  {
    id: "pr0a9",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-01-20T08:00:00.000Z",
    prices_json: { corriente: 12570, premium: 13900, diesel: 11290 },
  },
  {
    id: "pr0aa",
    station_id: "0000000a-0000-4000-8000-00000000000a",
    created_at: "2026-01-13T08:00:00.000Z",
    prices_json: { corriente: 12520, premium: 13850, diesel: 11240 },
  },
];
