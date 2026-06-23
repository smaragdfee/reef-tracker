import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { PARAMETERS } from "../data/parameters";

export function HistoryPage({ history }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-slate-500">
        {history.length} Messungen gespeichert
      </p>

      {PARAMETERS.map((param) => {
        const chartData = history
          .filter((h) => h[param.id] !== null)
          .map((h) => ({ date: h.date, value: h[param.id] }));

        if (chartData.length < 2) return null;

        return (
          <div
            key={param.id}
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: param.color }} />
              <span className="text-sm font-semibold text-slate-200">{param.label}</span>
              <span className="text-xs text-slate-500 ml-auto">{param.unit}</span>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[
                      Math.min(param.min * 0.95, ...chartData.map((d) => d.value)),
                      Math.max(param.max * 1.05, ...chartData.map((d) => d.value)),
                    ]}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
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
                  <ReferenceLine y={param.min} stroke="rgba(248,113,113,0.25)" strokeDasharray="3 3" />
                  <ReferenceLine y={param.max} stroke="rgba(248,113,113,0.25)" strokeDasharray="3 3" />
                  <ReferenceLine y={param.ideal} stroke="rgba(255,255,255,0.1)" strokeDasharray="2 4" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={param.color}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: param.color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1 px-1">
              <span>Min: {param.min}</span>
              <span>Ideal: {param.ideal}</span>
              <span>Max: {param.max}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}