import { useState } from "react";
import { useWaterTests } from "./hooks/useWaterTests";
import { useAquariums } from "./hooks/useAquariums";
import { TestPage } from "./pages/TestPage";
import { HistoryPage } from "./pages/HistoryPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AquariumSelector } from "./components/AquariumSelector";
import { Sidebar } from "./components/Sidebar";
import { AdditiveTracker } from "./components/AdditiveTracker";
import { SaltCalculator } from "./pages/calculators/SaltCalculator";

function PlaceholderPage({ icon, label }) {
  return (
    <div style={{ textAlign: "center", paddingTop: "72px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-salt-mist)",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "14px" }}>
        Diese Funktion ist noch in Entwicklung.
      </p>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("test");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { aquariums, activeAquarium, loading, setActiveId, addAquarium } = useAquariums();
  const {
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMeasurementsByAquarium,
  } = useWaterTests(activeAquarium?.id);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#071826",
        }}
      >
        <span style={{ fontSize: "40px" }}>🪸</span>
      </div>
    );
  }

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

  function renderView() {
    switch (activeView) {
      case "test":
        return (
          <TestPage
            measurements={getMeasurementsByAquarium(activeAquarium?.id)}
            addMeasurement={addMeasurement}
            aquariumId={activeAquarium?.id}
          />
        );
      case "history":
        return (
          <HistoryPage
            measurements={getMeasurementsByAquarium(activeAquarium?.id)}
            deleteMeasurement={deleteMeasurement}
            updateMeasurement={updateMeasurement}
          />
        );
      case "dashboard":
        return <PlaceholderPage icon="🏠" label="Dashboard" />;
      case "bestand":
        return <PlaceholderPage icon="🐠" label="Bestand" />;
      case "technik":
        return <PlaceholderPage icon="🔧" label="Technik" />;
      case "rechner":
        return <SaltCalculator />;
      case "erinnerungen":
        return <AdditiveTracker />;
      case "einstellungen":
        return <PlaceholderPage icon="⚙️" label="Einstellungen" />;
      default:
        return <PlaceholderPage icon="🚧" label="Kommt bald" />;
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#071826" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={setActiveView}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-salt-mist)",
              fontSize: "20px",
              lineHeight: "1",
              padding: "2px 4px",
            }}
          >
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "18px" }}>🪸</span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-salt-mist)",
                fontSize: "15px",
                fontWeight: "600",
                letterSpacing: "-0.02em",
              }}
            >
              Atolliq
            </span>
          </div>
        </div>

        <AquariumSelector
          aquariums={aquariums}
          activeAquarium={activeAquarium}
          onSelect={setActiveId}
          onAdd={() => setShowOnboarding(true)}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 40px", maxWidth: "640px", margin: "0 auto" }}>
        {renderView()}
      </div>
    </div>
  );
}
