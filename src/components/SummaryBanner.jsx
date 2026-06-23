import { PARAMETERS } from "../data/parameters";
import { getStatus } from "./StatusDot";

export function SummaryBanner({ values }) {
  const statuses = PARAMETERS.map((p) => getStatus(p, values[p.id]));
  const dangers = statuses.filter((s) => s === "danger").length;
  const warns = statuses.filter((s) => s === "warn").length;
  const goods = statuses.filter((s) => s === "good").length;
  const filled = statuses.filter((s) => s !== "empty").length;

  if (filled === 0)
    return (
      <div
        className="rounded-2xl px-5 py-4 text-sm text-slate-400"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        Trag deine heutigen Werte ein – du siehst sofort ob alles stimmt.
      </div>
    );

  if (dangers > 0)
    return (
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-3"
        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-red-400">
            {dangers} Wert{dangers > 1 ? "e" : ""} außerhalb des Bereichs
          </p>
          <p className="text-xs text-slate-400">Bitte zeitnah überprüfen und korrigieren.</p>
        </div>
      </div>
    );

  if (warns > 0)
    return (
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-3"
        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
      >
        <span className="text-2xl">🟡</span>
        <div>
          <p className="text-sm font-semibold text-amber-400">
            {warns} Wert{warns > 1 ? "e" : ""} grenzwertig
          </p>
          <p className="text-xs text-slate-400">Beobachten – Tendenz beim nächsten Test prüfen.</p>
        </div>
      </div>
    );

  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center gap-3"
      style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}
    >
      <span className="text-2xl">🐠</span>
      <div>
        <p className="text-sm font-semibold text-emerald-400">
          Alle {goods} Werte im grünen Bereich
        </p>
        <p className="text-xs text-slate-400">Dein Riff ist happy. ✨</p>
      </div>
    </div>
  );
}