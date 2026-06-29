// Data source: faunamarin.de - official product pages
// Last verified: June 2026
// All dosing values verified from official Fauna Marin sources

export const FAUNA_MARIN_ELEMENTS = [
  // MAKROELEMENTE
  {
    id: "calcium",
    name: "Calcium",
    symbol: "Ca",
    category: "macro",
    unit: "mg/l",
    min: 380, optimal: 420, max: 450,
    product: "Fauna Marin Balling Light Teil A",
    mlPer100L_per_unit: 1.43, // raises Ca by 7mg/L per 10ml/100L
    unit_raise: "mg/l",
    maxDailyRaise: 20,
    notes: "Langsam anheben, max. 20mg/l pro Tag"
  },
  {
    id: "kh",
    name: "KH / Karbonathärte",
    symbol: "KH",
    category: "macro",
    unit: "dKH",
    min: 6.5, optimal: 7.5, max: 8.5,
    product: "Fauna Marin Balling Light Teil B",
    mlPer100L_per_unit: 27.8, // raises KH by 0.36 dKH per 10ml/100L
    unit_raise: "dKH",
    maxDailyRaise: 2,
    notes: "Max. 2 dKH Anhebung pro Tag"
  },
  {
    id: "magnesium",
    name: "Magnesium",
    symbol: "Mg",
    category: "macro",
    unit: "mg/l",
    min: 1200, optimal: 1325, max: 1450,
    product: "Fauna Marin Balling Light Teil C",
    mlPer100L_per_unit: 1.11, // raises Mg by 9mg/L per 10ml/100L
    unit_raise: "mg/l",
    maxDailyRaise: 50,
    notes: "Langsam anheben, max. 50mg/l pro Tag"
  },
  {
    id: "kalium",
    name: "Kalium",
    symbol: "K",
    category: "macro",
    unit: "mg/l",
    min: 380, optimal: 400, max: 420,
    product: "Fauna Marin Elementals K",
    mlPer100L_per_unit: null,
    unit_raise: "mg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "strontium",
    name: "Strontium",
    symbol: "Sr",
    category: "macro",
    unit: "mg/l",
    min: 6.5, optimal: 7.25, max: 8.0,
    product: "Fauna Marin Elementals Sr",
    mlPer100L_per_unit: null,
    unit_raise: "mg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "bor",
    name: "Bor",
    symbol: "B",
    category: "macro",
    unit: "mg/l",
    min: 3.8, optimal: 4.46, max: 5.5,
    product: "Fauna Marin Elementals B",
    mlPer100L_per_unit: null,
    unit_raise: "mg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "brom",
    name: "Brom",
    symbol: "Br",
    category: "macro",
    unit: "mg/l",
    min: 55, optimal: 65, max: 75,
    product: "Fauna Marin Elementals Br",
    mlPer100L_per_unit: null,
    unit_raise: "mg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "schwefel",
    name: "Schwefel",
    symbol: "S",
    category: "macro",
    unit: "mg/l",
    min: 850, optimal: 900, max: 950,
    product: "Fauna Marin Elementals S",
    mlPer100L_per_unit: null,
    unit_raise: "mg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "fluorid",
    name: "Fluorid",
    symbol: "F",
    category: "macro",
    unit: "mg/l",
    min: 0.9, optimal: 1.25, max: 1.6,
    product: "Fauna Marin Elementals F",
    mlPer100L_per_unit: null,
    unit_raise: "mg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },

  // SPURENELEMENTE (alle Werte von lab.faunamarin.de + Produktseiten)
  {
    id: "zink",
    name: "Zink",
    symbol: "Zn",
    category: "trace",
    unit: "µg/l",
    min: 3, optimal: 5.5, max: 8,
    product: "Fauna Marin Elementals Trace Zn",
    mlPer100L_per_unit: 0.1, // 1ml/100L = +10µg/L → 0.1ml per 1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 3,
    notes: "Tageshöchstdosis: +3µg/l (0.3ml/100L)"
  },
  {
    id: "nickel",
    name: "Nickel",
    symbol: "Ni",
    category: "trace",
    unit: "µg/l",
    min: 3, optimal: 4.5, max: 6,
    product: "Fauna Marin Elementals Trace Ni",
    mlPer100L_per_unit: 0.25, // 1ml/100L = +4µg/L → 0.25ml per 1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 4,
    notes: "1ml/100L = +4µg/l Nickel"
  },
  {
    id: "selen",
    name: "Selen",
    symbol: "Se",
    category: "trace",
    unit: "µg/l",
    min: 0.9, optimal: 3.2, max: 5.5,
    product: "Fauna Marin Elementals Trace Se",
    mlPer100L_per_unit: 2.0, // 1ml/100L = +0.5µg/L → 2ml per 1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 1,
    notes: "1ml/100L = +0.5µg/l Selen. Max. +1µg/l pro Tag (2ml/100L)"
  },
  {
    id: "vanadium",
    name: "Vanadium",
    symbol: "V",
    category: "trace",
    unit: "µg/l",
    min: 2, optimal: 6, max: 10,
    product: "Fauna Marin Elementals Trace V",
    mlPer100L_per_unit: 0.2, // 1ml/100L = +5µg/L → 0.2ml per 1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 5,
    notes: "1ml/100L = +5µg/l Vanadium"
  },
  {
    id: "kupfer",
    name: "Kupfer",
    symbol: "Cu",
    category: "trace",
    unit: "µg/l",
    min: 2, optimal: 4, max: 6,
    product: "Fauna Marin Elementals Trace Cu",
    mlPer100L_per_unit: 1.0, // 1ml/100L = +1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 2,
    notes: "1ml/100L = +1µg/l Kupfer. Vorsicht: toxisch bei Überdosierung!"
  },
  {
    id: "molybdaen",
    name: "Molybdän",
    symbol: "Mo",
    category: "trace",
    unit: "µg/l",
    min: 10, optimal: 15, max: 20,
    product: "Fauna Marin Elementals Trace Mo",
    mlPer100L_per_unit: 0.167, // 1ml/100L = +6µg/L → 0.167ml per 1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 6,
    notes: "1ml/100L = +6µg/l Molybdän"
  },
  {
    id: "iod",
    name: "Iod",
    symbol: "I",
    category: "trace",
    unit: "mg/l",
    min: 0.055, optimal: 0.0675, max: 0.08,
    product: "Fauna Marin Elementals Trace I",
    mlPer100L_per_unit: 0.1, // 1ml/100L = +10µg/L = +0.01mg/L
    unit_raise: "mg/l",
    maxDailyRaise: 0.02,
    notes: "1ml/100L = +0.01mg/l Iod"
  },
  {
    id: "eisen",
    name: "Eisen",
    symbol: "Fe",
    category: "trace",
    unit: "µg/l",
    min: 0.05, optimal: 1.275, max: 2.5,
    product: "Fauna Marin Elementals Trace Fe",
    mlPer100L_per_unit: null,
    unit_raise: "µg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "mangan",
    name: "Mangan",
    symbol: "Mn",
    category: "trace",
    unit: "µg/l",
    min: 0.1, optimal: 0.175, max: 0.25,
    product: "Fauna Marin Elementals Trace Mn",
    mlPer100L_per_unit: null,
    unit_raise: "µg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "lithium",
    name: "Lithium",
    symbol: "Li",
    category: "trace",
    unit: "µg/l",
    min: 180, optimal: 265, max: 350,
    product: "Fauna Marin Elementals Trace Li",
    mlPer100L_per_unit: 0.067, // 1ml/100L = +15µg/L → 0.067ml per 1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 30,
    notes: "1ml/100L = +15µg/l Lithium. Max. +30µg/l pro Tag"
  },
  {
    id: "barium",
    name: "Barium",
    symbol: "Ba",
    category: "trace",
    unit: "µg/l",
    min: 5, optimal: 10, max: 50,
    product: "Fauna Marin Elementals Trace Ba",
    mlPer100L_per_unit: 1.0, // 1ml/100L = +1µg/L
    unit_raise: "µg/l",
    maxDailyRaise: 10,
    notes: "1ml/100L = +1µg/l Barium. Max. +10µg/l pro Tag"
  },
  {
    id: "chrom",
    name: "Chrom",
    symbol: "Cr",
    category: "trace",
    unit: "µg/l",
    min: 0.05, optimal: 1.175, max: 2.3,
    product: "Fauna Marin Elementals Trace Cr",
    mlPer100L_per_unit: null,
    unit_raise: "µg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "kobalt",
    name: "Kobalt",
    symbol: "Co",
    category: "trace",
    unit: "µg/l",
    min: 0.02, optimal: 0.96, max: 1.9,
    product: "Fauna Marin Elementals Trace Co",
    mlPer100L_per_unit: null,
    unit_raise: "µg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
  {
    id: "rubidium",
    name: "Rubidium",
    symbol: "Rb",
    category: "trace",
    unit: "µg/l",
    min: 70, optimal: 100, max: 130,
    product: "Fauna Marin Elementals Trace Rb",
    mlPer100L_per_unit: null,
    unit_raise: "µg/l",
    maxDailyRaise: null,
    notes: "Dosierung nach ICP-Empfehlung"
  },
];

export const SALT_PRODUCTS = [
  {
    id: "fm-professional",
    name: "Professional Sea Salt",
    brand: "Fauna Marin",
    gramsPerLiter: 38.0, // for 35ppt
    targetSalinity: 35,
    notes: "Empfohlen von Fauna Marin für Riffaquarien"
  },
  {
    id: "tm-pro-reef",
    name: "Pro-Reef Salt",
    brand: "Tropic Marin",
    gramsPerLiter: 36.6,
    targetSalinity: 35,
    notes: "Klassiker für Riffaquarien"
  },
  {
    id: "tm-classic",
    name: "Classic Salt",
    brand: "Tropic Marin",
    gramsPerLiter: 34.0,
    targetSalinity: 35,
    notes: "Standardsalz"
  },
  {
    id: "rs-coral-pro",
    name: "Coral Pro Salt",
    brand: "Red Sea",
    gramsPerLiter: 38.5,
    targetSalinity: 35,
    notes: "Erhöhte Calcium/KH Werte"
  },
  {
    id: "rs-salt",
    name: "Red Sea Salt",
    brand: "Red Sea",
    gramsPerLiter: 37.0,
    targetSalinity: 35,
    notes: "Standardsalz von Red Sea"
  },
  {
    id: "af-reef-salt",
    name: "Reef Salt",
    brand: "Aquaforest",
    gramsPerLiter: 36.5,
    targetSalinity: 35,
    notes: "Mit Probiotika angereichert"
  },
];
