import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid,
} from "recharts";
import { PARAMETERS } from "../data/parameters";
import { getStatus } from "../components/StatusDot";
import { MeasurementDetailPage } from "./MeasurementDetailPage";

// ── constants ─────────────────────────────────────────────────────────────────

const PARAM_MAP = Object.fromEntries(PARAMETERS.map((p) => [p.id, p]));

const TIME_RANGES = [
  { label: "7T",     days: 7   },
  { label: "30T",    days: 30  },
  { label: "90T",    days: 90  },
  { label: "Gesamt", days: null },
];

const DEFAULT_SELECTED = ["calcium", "kh", "magnesium"];

const STATUS_VALUE_COLOR = {
  good:   "#1DCE8A",
  warn:   "#F59E0B",
  danger: "#EF4444",
  empty:  "#4A7A8A",
};

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

function fmtFull(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) +
    " Uhr"
  );
}

function filterByRange(measurements, days) {
  if (!days) return measurements;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return measurements.filter((m) => new Date(m.timestamp) >= cutoff);
}

// ── custom tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, param }) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div
      style={{
        backgroundColor: "#0C2D40",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "8px 12px",
      }}
    >
      <p style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "11px", marginBottom: "4px" }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-mono)", color: param.color, fontSize: "13px", fontWeight: "500" }}>
        {v} {param.unit}
      </p>
    </div>
  );
}

// ── section 1: time range ─────────────────────────────────────────────────────

function TimeRangeSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {TIME_RANGES.map((r) => {
        const active = r.label === value;
        return (
          <button
            key={r.label}
            onClick={() => onChange(r.label)}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              border: active
                ? "1px solid rgba(29,206,138,0.3)"
                : "1px solid rgba(255,255,255,0.08)",
              backgroundColor: active ? "rgba(29,206,138,0.15)" : "transparent",
              color: active ? "#1DCE8A" : "#4A7A8A",
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

// ── section 2: parameter chips ────────────────────────────────────────────────

function ParameterSelector({ selected, onToggle }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          color: "#4A7A8A",
          fontSize: "10px",
          fontWeight: "600",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        Parameter
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {PARAMETERS.map((p) => {
          const on = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 11px",
                borderRadius: "9999px",
                border: on
                  ? `1px solid ${p.color}40`
                  : "1px solid rgba(255,255,255,0.06)",
                backgroundColor: on ? `${p.color}18` : "var(--color-deep)",
                color: on ? p.color : "#4A7A8A",
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {on && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: p.color,
                    flexShrink: 0,
                  }}
                />
              )}
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── section 3: chart ──────────────────────────────────────────────────────────

function ParameterMiniChart({ param, data }) {
  if (data.length < 2) {
    return (
      <div
        style={{
          backgroundColor: "var(--color-deep)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "14px",
          padding: "16px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: param.color, flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-heading)", color: "#9FC5D8", fontSize: "13px", fontWeight: "600" }}>
            {param.label}
          </span>
          <span style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "11px", marginLeft: "auto" }}>
            {param.unit}
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "12px", textAlign: "center", padding: "24px 0" }}>
          Nicht genug Daten für einen Graphen
        </p>
      </div>
    );
  }

  const values = data.map((d) => d.value).filter((v) => v != null);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const padding = Math.max((param.max - param.min) * 0.2, (dataMax - dataMin) * 0.3, 0.01);
  const domain = [
    Math.min(dataMin, param.min) - padding,
    Math.max(dataMax, param.max) + padding,
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--color-deep)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "16px 18px 12px",
      }}
    >
      {/* Chart header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: param.color,
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: "var(--font-heading)", color: "#9FC5D8", fontSize: "13px", fontWeight: "600" }}>
          {param.label}
        </span>
        <span style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "11px" }}>
          {param.unit}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            color: "#4A7A8A",
            fontSize: "10px",
          }}
        >
          Ideal: {param.ideal} · {param.min}–{param.max}
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: "120px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid
              strokeDasharray="1 0"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#4A7A8A", fontFamily: "var(--font-body)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={domain}
              tick={{ fontSize: 10, fill: "#4A7A8A", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              width={38}
              tickCount={4}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} param={param} />}
            />
            <ReferenceLine y={param.min}   stroke="rgba(239,68,68,0.3)"    strokeDasharray="4 3" />
            <ReferenceLine y={param.max}   stroke="rgba(239,68,68,0.3)"    strokeDasharray="4 3" />
            <ReferenceLine y={param.ideal} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 5" />
            <Line
              type="monotone"
              dataKey="value"
              stroke={param.color}
              strokeWidth={2}
              dot={{ r: 3, fill: param.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: param.color }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── section 4: measurements list ──────────────────────────────────────────────

function MeasurementEntry({ measurement, onOpen }) {
  const keyIds = ["calcium", "kh", "nitrat"];
  const keySummary = keyIds
    .map((id) => ({ param: PARAM_MAP[id], value: measurement.values?.[id] }))
    .filter(({ value }) => value != null);

  return (
    <div
      onClick={() => onOpen(measurement.id)}
      style={{
        backgroundColor: "var(--color-deep)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "13px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            color: "#9FC5D8",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {fmtFull(measurement.timestamp)}
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {keySummary.map(({ param, value }) => {
            const status = getStatus(param, value);
            return (
              <span
                key={param.id}
                style={{
                  fontFamily: "var(--font-mono)",
                  color: STATUS_VALUE_COLOR[status],
                  fontSize: "11px",
                }}
              >
                {param.label.split(/[\s/]/)[0]} {value}
              </span>
            );
          })}
        </div>
        {measurement.notes?.trim() && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#4A7A8A",
              fontSize: "11px",
              fontStyle: "italic",
              marginTop: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {measurement.notes}
          </p>
        )}
      </div>
      <span style={{ color: "#4A7A8A", fontSize: "14px", flexShrink: 0 }}>›</span>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function HistoryPage({ measurements = [], deleteMeasurement, updateMeasurement }) {
  const [timeRange, setTimeRange] = useState("30T");
  const [selectedParams, setSelectedParams] = useState(DEFAULT_SELECTED);
  const [listOpen, setListOpen] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const selectedMeasurement = measurements.find((m) => m.id === selectedId) ?? null;

  if (selectedMeasurement) {
    return (
      <MeasurementDetailPage
        measurement={selectedMeasurement}
        onBack={() => setSelectedId(null)}
        onDelete={(id) => { deleteMeasurement(id); setSelectedId(null); }}
        onUpdate={(id, vals, notes, ts) => updateMeasurement(id, vals, notes, ts)}
      />
    );
  }

  const rangeDays = TIME_RANGES.find((r) => r.label === timeRange)?.days ?? null;

  const filtered = useMemo(
    () => filterByRange(measurements, rangeDays),
    [measurements, rangeDays]
  );

  const forChart = useMemo(
    () => [...filtered].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    [filtered]
  );

  const forList = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [filtered]
  );

  function toggleParam(id) {
    setSelectedParams((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  const isEmpty = measurements.length === 0;
  const noDataInRange = !isEmpty && filtered.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* 1 · Time range */}
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

      {/* 2 · Parameter chips */}
      <ParameterSelector selected={selectedParams} onToggle={toggleParam} />

      {/* 3 · Charts */}
      {isEmpty ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px",
          }}
        >
          <p style={{ fontFamily: "var(--font-heading)", color: "#9FC5D8", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
            Noch keine Messungen
          </p>
          <p style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "13px" }}>
            Füge deine erste Messung im Wassertest hinzu.
          </p>
        </div>
      ) : noDataInRange ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 24px",
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "13px" }}>
            Keine Messungen im gewählten Zeitraum.
          </p>
        </div>
      ) : selectedParams.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 24px",
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "13px" }}>
            Wähle mindestens einen Parameter aus.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {selectedParams.map((id) => {
            const param = PARAM_MAP[id];
            if (!param) return null;
            const chartData = forChart
              .map((m) => ({ date: fmtDate(m.timestamp), value: m.values?.[id] ?? null }))
              .filter((d) => d.value != null);
            return <ParameterMiniChart key={id} param={param} data={chartData} />;
          })}
        </div>
      )}

      {/* 4 · Measurements list */}
      <div>
        <button
          onClick={() => setListOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 0 12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              color: "#4A7A8A",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            Alle Messungen ({forList.length})
          </span>
          <span
            style={{
              color: "#4A7A8A",
              fontSize: "9px",
              display: "inline-block",
              transform: listOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </button>

        {listOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {forList.length === 0 ? (
              <p style={{ fontFamily: "var(--font-body)", color: "#4A7A8A", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
                Keine Einträge im gewählten Zeitraum.
              </p>
            ) : (
              forList.map((m) => (
                <MeasurementEntry
                  key={m.id}
                  measurement={m}
                  onOpen={setSelectedId}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
