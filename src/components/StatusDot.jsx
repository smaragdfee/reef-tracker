export function getStatus(param, value) {
  if (value === "" || value === null || value === undefined) return "empty";
  const v = parseFloat(value);
  if (isNaN(v)) return "empty";
  if (v < param.min || v > param.max) return "danger";
  const range = param.max - param.min;
  const distFromIdeal = Math.abs(v - param.ideal);
  if (distFromIdeal > range * 0.25) return "warn";
  return "good";
}

export function StatusDot({ status }) {
  const colors = {
    good: "bg-emerald-400",
    warn: "bg-amber-400",
    danger: "bg-red-500",
    empty: "bg-slate-600",
  };
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]} shadow-sm`} />
  );
}

export function StatusBar({ status }) {
  const map = {
    good: { label: "Im Bereich", cls: "text-emerald-400" },
    warn: { label: "Grenzwertig", cls: "text-amber-400" },
    danger: { label: "Außerhalb", cls: "text-red-400" },
    empty: { label: "—", cls: "text-slate-500" },
  };
  const s = map[status];
  return <span className={`text-xs font-medium ${s.cls}`}>{s.label}</span>;
}