import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { StatusDot, StatusBar, getStatus } from "./StatusDot";

export function ParamCard({ param, value, onChange, history }) {
  const status = getStatus(param, value);
  const chartData = history.map((h) => ({
    date: h.date,
    value: h[param.id],
  }));

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-deep)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <StatusDot status={status} />
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-salt-mist)",
              }}
            >
              {param.label}
            </span>
          </div>
          <p
            className="text-xs ml-4"
            style={{ color: "var(--color-deep-mist)" }}
          >
            {param.description}
          </p>
        </div>
        <StatusBar status={status} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${param.ideal}`}
          className="w-28 rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{
            fontFamily: "var(--font-mono)",
            backgroundColor: "var(--color-abyssal)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--color-salt-mist)",
          }}
        />
        <span
          className="text-xs"
          style={{ color: "var(--color-deep-mist)" }}
        >
          {param.unit}
        </span>
        <span
          className="text-xs ml-auto"
          style={{ color: "var(--color-deep-mist)", fontFamily: "var(--font-mono)" }}
        >
          Ziel: {param.ideal} · {param.min}–{param.max}
        </span>
      </div>

      {chartData.length > 1 && (
        <div className="h-16 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" hide />
              <YAxis
                domain={[
                  Math.min(param.min * 0.95, ...chartData.map((d) => d.value)),
                  Math.max(param.max * 1.05, ...chartData.map((d) => d.value)),
                ]}
                hide
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-deep)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "var(--color-salt-mist)",
                  fontFamily: "var(--font-mono)",
                }}
                formatter={(v) => [`${v} ${param.unit}`, param.label]}
              />
              <ReferenceLine y={param.min} stroke="rgba(239,68,68,0.25)" strokeDasharray="3 3" />
              <ReferenceLine y={param.max} stroke="rgba(239,68,68,0.25)" strokeDasharray="3 3" />
              <ReferenceLine y={param.ideal} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
              <Line
                type="monotone"
                dataKey="value"
                stroke={param.color}
                strokeWidth={2}
                dot={{ r: 3, fill: param.color, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}