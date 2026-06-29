import { useState, useEffect } from "react";
import { DEMO_MEASUREMENTS } from "../data/parameters";

const STORAGE_KEY = "atolliq_measurements";

// ── persistence helpers ───────────────────────────────────────────────────────

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveAll(measurements) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  } catch {}
}

function parseValues(vals) {
  return Object.fromEntries(
    Object.entries(vals).map(([k, v]) => {
      const n = parseFloat(v);
      return [k, isNaN(n) ? null : n];
    })
  );
}

// Convert a measurement to the flat shape that HistoryPage / ParamCard expect:
// { date: "28.06", calcium: 418, kh: 9.4, … }
function toFlatEntry(m) {
  const d = new Date(m.timestamp);
  const date = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  return { date, ...m.values };
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useWaterTests(activeAquariumId = null) {
  const [measurements, setMeasurements] = useState(() => {
    const stored = loadAll();
    // First run: seed with demo data
    if (!stored) return DEMO_MEASUREMENTS;
    return stored;
  });

  // Form state for the current (unsaved) measurement
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState(false);

  // Persist whenever measurements change
  useEffect(() => {
    saveAll(measurements);
  }, [measurements]);

  // ── CRUD ────────────────────────────────────────────────────────────────────

  function addMeasurement(
    aquariumId,
    vals,
    notes = "",
    timestamp = new Date().toISOString()
  ) {
    const entry = {
      id: crypto.randomUUID(),
      aquariumId: aquariumId ?? null,
      timestamp,
      values: parseValues(vals),
      notes,
    };
    setMeasurements((prev) => [...prev, entry]);
    return entry;
  }

  function updateMeasurement(id, vals, notes, timestamp) {
    setMeasurements((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          ...(vals      !== undefined && { values: parseValues(vals) }),
          ...(notes     !== undefined && { notes }),
          ...(timestamp !== undefined && { timestamp }),
        };
      })
    );
  }

  function deleteMeasurement(id) {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  }

  function getLatestMeasurement(aquariumId) {
    return getMeasurementsByAquarium(aquariumId).at(-1) ?? null;
  }

  function getMeasurementsByAquarium(aquariumId) {
    return measurements
      .filter((m) => m.aquariumId === aquariumId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // ── backward-compatible form API ─────────────────────────────────────────────

  function handleChange(paramId, val) {
    setValues((v) => ({ ...v, [paramId]: val }));
    setSaved(false);
  }

  function handleSave() {
    addMeasurement(activeAquariumId, values);
    setSaved(true);
  }

  const hasValues = Object.values(values).some(
    (v) => v !== "" && v !== null && v !== undefined
  );

  // History in the flat format that HistoryPage / ParamCard still expect.
  // For a known aquarium: its real measurements.
  // Fallback (no aquarium yet): the seeded demo entries so charts still render.
  const aquariumMeasurements = activeAquariumId
    ? getMeasurementsByAquarium(activeAquariumId)
    : measurements
        .filter((m) => m.aquariumId === "__demo__")
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const history = aquariumMeasurements.map(toFlatEntry);

  return {
    // Form API (backward-compatible)
    values,
    history,
    saved,
    hasValues,
    handleChange,
    handleSave,
    // New API
    measurements,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getLatestMeasurement,
    getMeasurementsByAquarium,
  };
}
