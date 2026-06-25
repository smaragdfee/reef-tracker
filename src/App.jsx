import { useState } from "react";
import { useWaterTests } from "./hooks/useWaterTests";
import { TestPage } from "./pages/TestPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  const [activeView, setActiveView] = useState("test");
  const { values, history, saved, hasValues, handleChange, handleSave } = useWaterTests();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-abyssal)" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-8 pb-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪸</span>
          <div>
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-salt-mist)",
                letterSpacing: "-0.02em",
              }}
            >
              Atolliq
            </h1>
            <p
              className="text-xs"
              style={{ color: "var(--color-deep-mist)" }}
            >
              502 Liter Meerwasser
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-5 pt-4 pb-2">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: "var(--color-deep)" }}
        >
          {[
            { id: "test", label: "Wassertest" },
            { id: "history", label: "Verlauf" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                fontFamily: "var(--font-heading)",
                backgroundColor:
  activeView === tab.id
    ? "rgba(29, 206, 138, 0.15)"
    : "transparent",
color:
  activeView === tab.id
    ? "var(--color-bioluminescent)"
    : "var(--color-deep-mist)",
border: activeView === tab.id
    ? "1px solid rgba(29, 206, 138, 0.3)"
    : "1px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-10 pt-4 max-w-2xl mx-auto">
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