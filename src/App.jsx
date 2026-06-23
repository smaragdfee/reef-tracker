import { useState } from "react";
import { useWaterTests } from "./hooks/useWaterTests";
import { TestPage } from "./pages/TestPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  const [activeView, setActiveView] = useState("test");
  const { values, history, saved, hasValues, handleChange, handleSave } = useWaterTests();

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d1f3c 50%, #091424 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🪸</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ReefTracker</h1>
            <p className="text-xs text-slate-500">502 Liter Meerwasser</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 mb-5">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {[
            { id: "test", label: "Wassertest" },
            { id: "history", label: "Verlauf" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-10">
        {activeView === "test" && (
          <TestPage
            values={values}
            history={history}
            saved={saved}
            hasValues={hasValues}
            handleChange={handleChange}
            handleSave={handleSave}
          />
        )}
        {activeView === "history" && (
          <HistoryPage history={history} />
        )}
      </div>
    </div>
  );
}