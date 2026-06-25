import { PARAMETERS } from "../data/parameters";
import { ParamCard } from "../components/ParamCard";
import { SummaryBanner } from "../components/SummaryBanner";

export function TestPage({ values, history, saved, hasValues, handleChange, handleSave }) {
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="flex flex-col gap-3 px-1">
      <SummaryBanner values={values} />

      {PARAMETERS.map((param) => (
        <ParamCard
          key={param.id}
          param={param}
          value={values[param.id] ?? ""}
          onChange={(v) => handleChange(param.id, v)}
          history={history}
        />
      ))}

      {hasValues && (
        <button
          onClick={() => handleSave(today)}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all mt-2"
          style={{
            fontFamily: "var(--font-heading)",
            backgroundColor: saved
              ? "var(--color-reef)"
              : "var(--color-bioluminescent)",
            color: saved
              ? "var(--color-salt-mist)"
              : "var(--color-abyssal)",
          }}
        >
          {saved ? "✓ Gespeichert" : "Messung speichern"}
        </button>
      )}
    </div>
  );
}