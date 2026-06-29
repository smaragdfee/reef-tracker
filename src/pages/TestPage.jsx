import { useState } from "react";
import { PARAMETERS } from "../data/parameters";
import { getStatus } from "../components/StatusDot";

// ── parameter grouping ────────────────────────────────────────────────────────

const HAUPTWERTE  = ["calcium", "kh", "magnesium"];
const NAEHRSTOFFE = ["nitrat", "nitrit", "phosphat"];
const WEITERE     = ["salinity", "temperature", "ph"];

const byId = Object.fromEntries(PARAMETERS.map((p) => [p.id, p]));

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtTimestamp(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  return `${date} um ${time} Uhr`;
}

function toDatetimeLocal(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function getTrend(lastVals, prevVals, paramId) {
  const a = prevVals?.[paramId];
  const b = lastVals?.[paramId];
  if (a == null || b == null) return null;
  const p = byId[paramId];
  const threshold = p ? (p.max - p.min) * 0.015 : 0.001;
  const diff = b - a;
  if (Math.abs(diff) < threshold) return "→";
  return diff > 0 ? "↑" : "↓";
}

// ── color maps ────────────────────────────────────────────────────────────────

const DOT_COLOR = {
  good:   "#1DCE8A",
  warn:   "#F59E0B",
  danger: "#EF4444",
  empty:  "rgba(74,122,138,0.4)",
};

const BORDER_COLOR = {
  good:   "rgba(29,206,138,0.25)",
  warn:   "rgba(245,158,11,0.25)",
  danger: "rgba(239,68,68,0.3)",
  empty:  "rgba(255,255,255,0.06)",
};

const TREND_COLOR = { "↑": "#60a5fa", "↓": "#f87171", "→": "#4A7A8A" };

// ── shared styles ─────────────────────────────────────────────────────────────

const groupLabel = {
  fontFamily: "var(--font-heading)",
  color: "var(--color-deep-mist)",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "10px",
};

const baseInput = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  backgroundColor: "var(--color-abyssal)",
  color: "var(--color-salt-mist)",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  outline: "none",
};

// ── overview sub-components ───────────────────────────────────────────────────

function OverviewCard({ param, value, trend }) {
  const status = getStatus(param, value);
  return (
    <div
      style={{
        backgroundColor: "var(--color-deep)",
        border: `1px solid ${BORDER_COLOR[status]}`,
        borderRadius: "14px",
        padding: "14px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-deep-mist)",
            fontSize: "11px",
            fontWeight: "500",
            lineHeight: "1.2",
          }}
        >
          {param.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0, marginLeft: "4px" }}>
          {trend && (
            <span style={{ color: TREND_COLOR[trend], fontSize: "11px", fontWeight: "700" }}>
              {trend}
            </span>
          )}
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: DOT_COLOR[status],
              display: "inline-block",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* Value */}
      {value != null ? (
        <>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-salt-mist)",
              fontSize: "21px",
              fontWeight: "500",
              lineHeight: "1",
              marginBottom: "4px",
            }}
          >
            {value}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-deep-mist)",
              fontSize: "11px",
            }}
          >
            {param.unit || "pH"}
          </p>
        </>
      ) : (
        <p style={{ fontFamily: "var(--font-mono)", color: "rgba(74,122,138,0.35)", fontSize: "20px" }}>
          —
        </p>
      )}
    </div>
  );
}

function OverviewGroup({ label, ids, lastVals, prevVals }) {
  return (
    <div>
      <span style={groupLabel}>{label}</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {ids.map((id) => {
          const param = byId[id];
          if (!param) return null;
          return (
            <OverviewCard
              key={id}
              param={param}
              value={lastVals?.[id] ?? null}
              trend={prevVals ? getTrend(lastVals, prevVals, id) : null}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── entry sub-components ──────────────────────────────────────────────────────

function ParamInput({ param, value, onChange }) {
  const status = getStatus(param, value);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-deep-mist)",
            fontSize: "10px",
            fontWeight: "600",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {param.label}
        </span>
        {param.unit && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-deep-mist)",
              fontSize: "11px",
            }}
          >
            {param.unit}
          </span>
        )}
      </div>
      <input
        type="number"
        step="any"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={String(param.ideal)}
        style={{
          ...baseInput,
          fontFamily: "var(--font-mono)",
          border: `1px solid ${BORDER_COLOR[status]}`,
        }}
      />
    </div>
  );
}

function EntryGroup({ label, ids, formValues, onChange }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-deep)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "16px 16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {label && <span style={groupLabel}>{label}</span>}
      {ids.map((id) => {
        const param = byId[id];
        if (!param) return null;
        return (
          <ParamInput
            key={id}
            param={param}
            value={formValues[id]}
            onChange={(v) => onChange(id, v)}
          />
        );
      })}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function TestPage({ measurements = [], addMeasurement, aquariumId }) {
  const [mode, setMode] = useState("overview");
  const [formValues, setFormValues] = useState({});
  const [timestamp, setTimestamp] = useState(() => toDatetimeLocal(new Date().toISOString()));
  const [notes, setNotes] = useState("");
  const [showWeitere, setShowWeitere] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const sorted = [...measurements].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const lastM = sorted[sorted.length - 1] ?? null;
  const prevM = sorted[sorted.length - 2] ?? null;

  function onChange(paramId, val) {
    setFormValues((prev) => ({ ...prev, [paramId]: val }));
  }

  function handleSave() {
    if (!addMeasurement) return;
    const isoTs = timestamp
      ? new Date(timestamp).toISOString()
      : new Date().toISOString();
    addMeasurement(aquariumId, formValues, notes, isoTs);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
    setFormValues({});
    setNotes("");
    setTimestamp(toDatetimeLocal(new Date().toISOString()));
    setShowWeitere(false);
    setMode("overview");
  }

  const hasValues = Object.values(formValues).some(
    (v) => v !== "" && v != null
  );

  // ── OVERVIEW ──────────────────────────────────────────────────────────────

  if (mode === "overview") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Toast */}
        {toastVisible && (
          <div
            style={{
              position: "fixed",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "var(--color-bioluminescent)",
              color: "#071826",
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              fontWeight: "600",
              padding: "10px 24px",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(29,206,138,0.35)",
              zIndex: 100,
              whiteSpace: "nowrap",
            }}
          >
            ✓ Gespeichert
          </div>
        )}

        {/* Last measurement label */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-deep-mist)",
            fontSize: "12px",
          }}
        >
          {lastM
            ? `Letzte Messung: ${fmtTimestamp(lastM.timestamp)}`
            : "Noch keine Messung vorhanden"}
        </p>

        <OverviewGroup
          label="Hauptwerte"
          ids={HAUPTWERTE}
          lastVals={lastM?.values}
          prevVals={prevM?.values}
        />
        <OverviewGroup
          label="Nährstoffe"
          ids={NAEHRSTOFFE}
          lastVals={lastM?.values}
          prevVals={prevM?.values}
        />
        <OverviewGroup
          label="Weitere Werte"
          ids={WEITERE}
          lastVals={lastM?.values}
          prevVals={prevM?.values}
        />

        <button
          onClick={() => setMode("entry")}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
            fontSize: "15px",
            fontWeight: "600",
            backgroundColor: "var(--color-bioluminescent)",
            color: "#071826",
            marginTop: "4px",
          }}
        >
          Neue Messung +
        </button>
      </div>
    );
  }

  // ── ENTRY ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Back */}
      <button
        onClick={() => setMode("overview")}
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-heading)",
          color: "var(--color-salt-mist)",
          fontSize: "14px",
          fontWeight: "600",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ← Neue Messung
      </button>

      {/* Timestamp */}
      <div>
        <span
          style={{
            ...groupLabel,
            marginBottom: "6px",
          }}
        >
          Datum & Uhrzeit
        </span>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          style={{ ...baseInput, border: "1px solid rgba(255,255,255,0.06)", colorScheme: "dark" }}
        />
      </div>

      <EntryGroup
        label="Hauptwerte"
        ids={HAUPTWERTE}
        formValues={formValues}
        onChange={onChange}
      />

      <EntryGroup
        label="Nährstoffe"
        ids={NAEHRSTOFFE}
        formValues={formValues}
        onChange={onChange}
      />

      {/* Weitere Werte – collapsible */}
      <div>
        <button
          onClick={() => setShowWeitere((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
            color: "var(--color-deep-mist)",
            fontSize: "11px",
            fontWeight: "600",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "4px 0",
            marginBottom: showWeitere ? "12px" : 0,
          }}
        >
          Weitere Parameter anzeigen
          <span
            style={{
              display: "inline-block",
              fontSize: "9px",
              transform: showWeitere ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </button>
        {showWeitere && (
          <EntryGroup
            label="Weitere Werte"
            ids={WEITERE}
            formValues={formValues}
            onChange={onChange}
          />
        )}
      </div>

      {/* Notes */}
      <div>
        <span style={{ ...groupLabel, marginBottom: "6px" }}>Notizen (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Beobachtungen, Besonderheiten..."
          rows={2}
          style={{
            ...baseInput,
            border: "1px solid rgba(255,255,255,0.06)",
            resize: "none",
          }}
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!hasValues}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "16px",
          border: "none",
          cursor: hasValues ? "pointer" : "not-allowed",
          fontFamily: "var(--font-heading)",
          fontSize: "14px",
          fontWeight: "600",
          backgroundColor: hasValues
            ? "var(--color-bioluminescent)"
            : "rgba(29,206,138,0.12)",
          color: hasValues ? "#071826" : "var(--color-deep-mist)",
        }}
      >
        Messung speichern
      </button>
    </div>
  );
}
