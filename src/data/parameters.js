export const PARAMETERS = [
  {
    id: "calcium",
    label: "Calcium",
    unit: "mg/l",
    min: 380,
    max: 450,
    ideal: 420,
    color: "#60a5fa",
    description: "Wichtig für Korallenwachstum und Kalkskelett",
  },
  {
    id: "kh",
    label: "KH / Alkalinität",
    unit: "dKH",
    min: 7,
    max: 11,
    ideal: 9,
    color: "#34d399",
    description: "Puffert den pH-Wert des Wassers",
  },
  {
    id: "magnesium",
    label: "Magnesium",
    unit: "mg/l",
    min: 1250,
    max: 1400,
    ideal: 1320,
    color: "#a78bfa",
    description: "Stabilisiert Calcium & Karbonathärte",
  },
  {
    id: "nitrat",
    label: "Nitrat (NO₃)",
    unit: "mg/l",
    min: 0.5,
    max: 10,
    ideal: 3,
    color: "#fb923c",
    description: "Nährstoff für Zooxanthellen",
  },
  {
    id: "nitrit",
    label: "Nitrit (NO₂)",
    unit: "mg/l",
    min: 0,
    max: 0.1,
    ideal: 0,
    color: "#f87171",
    description: "Giftig – sollte nahe 0 sein",
  },
  {
    id: "phosphat",
    label: "Phosphat (PO₄)",
    unit: "mg/l",
    min: 0.02,
    max: 0.1,
    ideal: 0.05,
    color: "#fbbf24",
    description: "Niedrig halten gegen Algenbildung",
  },
  {
    id: "salinity",
    label: "Salinität",
    unit: "ppt",
    min: 34,
    max: 36,
    ideal: 35,
    color: "#67e8f9",
    description: "Salzgehalt des Meerwassers",
  },
  {
    id: "temperature",
    label: "Temperatur",
    unit: "°C",
    min: 24,
    max: 27,
    ideal: 25.5,
    color: "#f472b6",
    description: "Stabile Temperatur vermeidet Stress",
  },
  {
    id: "ph",
    label: "pH",
    unit: "",
    min: 7.8,
    max: 8.4,
    ideal: 8.2,
    color: "#818cf8",
    description: "Säure-Base-Gleichgewicht des Wassers",
  },
];

// Legacy flat format – kept so HistoryPage/TestPage keep working
// and for seeding empty localStorage on first run.
export const DEMO_HISTORY = [
  { date: "01.06", calcium: 408, kh: 8.2, magnesium: 1290, nitrat: 4.2, nitrit: 0.02, phosphat: 0.08, salinity: 35.0, temperature: 25.1, ph: 8.09 },
  { date: "07.06", calcium: 415, kh: 8.8, magnesium: 1310, nitrat: 3.8, nitrit: 0.01, phosphat: 0.06, salinity: 35.1, temperature: 25.3, ph: 8.15 },
  { date: "14.06", calcium: 422, kh: 9.1, magnesium: 1325, nitrat: 3.1, nitrit: 0.00, phosphat: 0.05, salinity: 35.0, temperature: 25.4, ph: 8.18 },
  { date: "21.06", calcium: 418, kh: 9.4, magnesium: 1340, nitrat: 2.9, nitrit: 0.00, phosphat: 0.04, salinity: 35.2, temperature: 25.5, ph: 8.21 },
];

// New structured format used by useWaterTests internally.
// aquariumId "__demo__" is the sentinel for seeded demo entries.
export const DEMO_MEASUREMENTS = DEMO_HISTORY.map((entry, i) => {
  const { date, ...values } = entry;
  // Spread four weekly offsets back from 28 Jun 2026
  const ts = new Date("2026-06-28T10:00:00.000Z");
  ts.setDate(ts.getDate() - (3 - i) * 7);
  return {
    id: `demo-${i + 1}`,
    aquariumId: "__demo__",
    timestamp: ts.toISOString(),
    values,
    notes: "",
  };
});
