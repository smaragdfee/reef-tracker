import { PARAMETERS } from "../data/parameters";
import { ParamCard } from "../components/ParamCard";
import { SummaryBanner } from "../components/SummaryBanner";

export function TestPage({ values, history, saved, hasValues, handleChange, handleSave }) {
  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4">
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
          className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {saved ? "✓ Gespeichert" : "Messung speichern"}
        </button>
      )}
    </div>
  );
}
