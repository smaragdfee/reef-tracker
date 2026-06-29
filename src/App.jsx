import { useState } from "react";
import { useWaterTests } from "./hooks/useWaterTests";
import { useAquariums } from "./hooks/useAquariums";
import { TestPage } from "./pages/TestPage";
import { HistoryPage } from "./pages/HistoryPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AquariumSelector } from "./components/AquariumSelector";

export default function App() {
  const [activeView, setActiveView] = useState("test");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { values, history, saved, hasValues, handleChange, handleSave } = useWaterTests();
  const {
    aquariums,
    activeAquarium,
    loading,
    setActiveId,
    addAquarium,
    deleteAquarium,
  } = useAquariums();

  // Ladescreen
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-abyssal)" }}
      >
        <span className="text-4xl">🪸</span>
      </div>
    );
  }

  // Onboarding – kein Aquarium vorhanden oder neu anlegen
  if (aquariums.length === 0 || showOnboarding) {
    return (
      <OnboardingPage
        onSave={(data) => {
          addAquarium(data);
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-abyssal)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "16px 16px 12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🪸</span>
          <span
            className="text-base font-semibold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
              letterSpacing: "-0.02em",
            }}
          >
            Atolliq
          </span>
        </div>

        <AquariumSelector
          aquariums={aquariums}
          activeAquarium={activeAquarium}
          onSelect={setActiveId}
          onAdd={() => setShowOnboarding(true)}
        />
      </div>

      {/* Navigation */}
      <div style={{ padding: "12px 16px 8px 16px" }}>
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
                border:
                  activeView === tab.id
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
      <div style={{ padding: "16px 16px 40px 16px", maxWidth: "640px", margin: "0 auto" }}>
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