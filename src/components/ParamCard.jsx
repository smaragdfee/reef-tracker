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
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <StatusDot status={status} />
            <span className="text-sm font-semibold text-slate-200">{param.label}</span>
          </div>
          <p className="text-xs text-slate-500 ml-4">{param.description}</p>
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
          className="w-28 rounded-lg px-3 py-2 text-sm font-mono bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-500"
        />
        <span className="text-xs text-slate-500">{param.unit}</span>
        <span className="text-xs text-slate-600 ml-auto">
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
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e2e8f0",
                }}
                formatter={(v) => [`${v} ${param.unit}`, param.label]}
              />
              <ReferenceLine y={param.min} stroke="rgba(248,113,113,0.3)" strokeDasharray="3 3" />
              <ReferenceLine y={param.max} stroke="rgba(248,113,113,0.3)" strokeDasharray="3 3" />
              <ReferenceLine y={param.ideal} stroke="rgba(255,255,255,0.12)" strokeDasharray="2 4" />
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