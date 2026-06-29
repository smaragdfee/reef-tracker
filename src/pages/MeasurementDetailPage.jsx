import { useState } from "react";
import { PARAMETERS } from "../data/parameters";
import { getStatus } from "../components/StatusDot";

// ── constants ─────────────────────────────────────────────────────────────────

const GROUPS = [
  { label: "Hauptwerte",    ids: ["calcium", "kh", "magnesium"] },
  { label: "Nährstoffe",    ids: ["nitrat", "nitrit", "phosphat"] },
  { label: "Weitere Werte", ids: ["salinity", "temperature", "ph"] },
];

const PARAM_MAP = Object.fromEntries(PARAMETERS.map((p) => [p.id, p]));

const STATUS_COLOR = {
  good:   "#1DCE8A",
  warn:   "#F59E0B",
  danger: "#EF4444",
  empty:  "rgba(74,122,138,0.35)",
};

const STATUS_TEXT = {
  good:   "#1DCE8A",
  warn:   "#F59E0B",
  danger: "#EF4444",
  empty:  "#4A7A8A",
};

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtFull(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) +
    " Uhr"
  );
}

function toDatetimeLocal(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ── shared styles ─────────────────────────────────────────────────────────────

const groupLabel = {
  fontFamily: "var(--font-heading)",
  color: "#4A7A8A",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "10px",
};

const fieldLabel = {
  fontFamily: "var(--font-heading)",
  color: "#4A7A8A",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const baseInput = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  backgroundColor: "var(--color-abyssal)",
  color: "#9FC5D8",
  fontFamily: "var(--font-mono)",
  fontSize: "14px",
  outline: "none",
};

const BORDER = {
  good:   "rgba(29,206,138,0.25)",
  warn:   "rgba(245,158,11,0.25)",
  danger: "rgba(239,68,68,0.3)",
  empty:  "rgba(255,255,255,0.06)",
};

// ── view mode sub-components ──────────────────────────────────────────────────

function ParamRow({ param, value }) {
  const status = getStatus(param, value);
  const hasValue = value != null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Status dot */}
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: STATUS_COLOR[status],
          flexShrink: 0,
        }}
      />

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-heading)",
          color: "#9FC5D8",
          fontSize: "13px",
          fontWeight: "500",
          flex: 1,
        }}
      >
        {param.label}
      </span>

      {/* Value + unit */}
      {hasValue ? (
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: STATUS_TEXT[status],
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {value}
          </span>
          {param.unit && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                color: "#4A7A8A",
                fontSize: "11px",
                marginLeft: "4px",
              }}
            >
              {param.unit}
            </span>
          )}
        </div>
      ) : (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(74,122,138,0.35)",
            fontSize: "14px",
          }}
        >
          —
        </span>
      )}
    </div>
  );
}

function ViewGroup({ label, ids, values }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-deep)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "14px 16px 4px",
      }}
    >
      <span style={groupLabel}>{label}</span>
      {ids.map((id) => {
        const param = PARAM_MAP[id];
        if (!param) return null;
        return (
          <ParamRow key={id} param={param} value={values?.[id] ?? null} />
        );
      })}
    </div>
  );
}

// ── edit mode sub-components ──────────────────────────────────────────────────

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
        <span style={fieldLabel}>{param.label}</span>
        {param.unit && (
          <span style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "11px" }}>
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
          border: `1px solid ${BORDER[status]}`,
        }}
      />
    </div>
  );
}

function EditGroup({ label, ids, formValues, onChange }) {
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
      <span style={groupLabel}>{label}</span>
      {ids.map((id) => {
        const param = PARAM_MAP[id];
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

export function MeasurementDetailPage({ measurement, onBack, onDelete, onUpdate }) {
  const [mode, setMode] = useState("view");
  const [formValues, setFormValues] = useState({});
  const [editTimestamp, setEditTimestamp] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function enterEdit() {
    setFormValues({ ...(measurement.values ?? {}) });
    setEditTimestamp(toDatetimeLocal(measurement.timestamp));
    setEditNotes(measurement.notes ?? "");
    setConfirmDelete(false);
    setMode("edit");
  }

  function handleChange(paramId, val) {
    setFormValues((prev) => ({ ...prev, [paramId]: val }));
  }

  function handleSave() {
    const isoTs = editTimestamp
      ? new Date(editTimestamp).toISOString()
      : measurement.timestamp;
    onUpdate(measurement.id, formValues, editNotes, isoTs);
    setMode("view");
  }

  function handleDelete() {
    onDelete(measurement.id);
    onBack();
  }

  // ── SHARED HEADER ────────────────────────────────────────────────────────────

  const header = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        marginBottom: "4px",
      }}
    >
      {/* Left: back or cancel */}
      <button
        onClick={mode === "edit" ? () => setMode("view") : onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-heading)",
          color: "#9FC5D8",
          fontSize: "14px",
          fontWeight: "600",
          padding: 0,
          flexShrink: 0,
        }}
      >
        {mode === "edit" ? "✕ Abbrechen" : "← Zurück"}
      </button>

      {/* Center: date */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          color: "#4A7A8A",
          fontSize: "11px",
          textAlign: "center",
          flex: 1,
        }}
      >
        {fmtFull(measurement.timestamp)}
      </p>

      {/* Right: edit or save */}
      {mode === "view" ? (
        <button
          onClick={enterEdit}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
            color: "#9FC5D8",
            fontSize: "12px",
            fontWeight: "600",
            padding: "5px 12px",
            flexShrink: 0,
          }}
        >
          Bearbeiten
        </button>
      ) : (
        <button
          onClick={handleSave}
          style={{
            background: "none",
            border: "1px solid rgba(29,206,138,0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
            color: "#1DCE8A",
            fontSize: "12px",
            fontWeight: "600",
            padding: "5px 12px",
            flexShrink: 0,
          }}
        >
          Speichern
        </button>
      )}
    </div>
  );

  // ── VIEW MODE ────────────────────────────────────────────────────────────────

  if (mode === "view") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {header}

        {GROUPS.map(({ label, ids }) => (
          <ViewGroup
            key={label}
            label={label}
            ids={ids}
            values={measurement.values}
          />
        ))}

        {/* Notes */}
        {measurement.notes?.trim() && (
          <div
            style={{
              backgroundColor: "var(--color-deep)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "14px 16px",
            }}
          >
            <span style={{ ...groupLabel, marginBottom: "8px" }}>Notizen</span>
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "#9FC5D8",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              {measurement.notes}
            </p>
          </div>
        )}

        {/* Delete */}
        <div>
          {confirmDelete ? (
            <div
              style={{
                backgroundColor: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#EF4444",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Messung wirklich löschen?
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: "13px",
                    fontWeight: "600",
                    backgroundColor: "#EF4444",
                    color: "#fff",
                  }}
                >
                  Ja, löschen
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: "13px",
                    fontWeight: "600",
                    backgroundColor: "transparent",
                    color: "#4A7A8A",
                  }}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(239,68,68,0.2)",
                cursor: "pointer",
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                fontWeight: "600",
                backgroundColor: "rgba(239,68,68,0.06)",
                color: "#EF4444",
              }}
            >
              Messung löschen
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── EDIT MODE ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {header}

      {/* Timestamp */}
      <div>
        <span style={{ ...groupLabel, marginBottom: "6px" }}>Datum & Uhrzeit</span>
        <input
          type="datetime-local"
          value={editTimestamp}
          onChange={(e) => setEditTimestamp(e.target.value)}
          style={{
            ...baseInput,
            fontFamily: "var(--font-body)",
            border: "1px solid rgba(255,255,255,0.06)",
            colorScheme: "dark",
          }}
        />
      </div>

      {GROUPS.map(({ label, ids }) => (
        <EditGroup
          key={label}
          label={label}
          ids={ids}
          formValues={formValues}
          onChange={handleChange}
        />
      ))}

      {/* Notes */}
      <div>
        <span style={{ ...groupLabel, marginBottom: "6px" }}>Notizen (optional)</span>
        <textarea
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          placeholder="Beobachtungen, Besonderheiten..."
          rows={3}
          style={{
            ...baseInput,
            fontFamily: "var(--font-body)",
            border: "1px solid rgba(255,255,255,0.06)",
            resize: "none",
          }}
        />
      </div>

      {/* Save + Cancel at bottom */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setMode("view")}
          style={{
            flex: 1,
            padding: "13px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: "transparent",
            color: "#4A7A8A",
          }}
        >
          Abbrechen
        </button>
        <button
          onClick={handleSave}
          style={{
            flex: 2,
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-heading)",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: "var(--color-bioluminescent)",
            color: "#071826",
          }}
        >
          Änderungen speichern
        </button>
      </div>
    </div>
  );
}
