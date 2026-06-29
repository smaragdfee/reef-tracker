import { useState } from "react";

const TANK_TYPES = ["Riff", "Fish-Only", "FOWLR", "Nano-Riff", "Becken in Aufbau"];

const label = {
  display: "block",
  marginBottom: "8px",
  fontFamily: "var(--font-heading)",
  color: "var(--color-deep-mist)",
  fontSize: "11px",
  fontWeight: "500",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const input = {
  width: "100%",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "var(--color-deep)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "var(--color-salt-mist)",
  fontFamily: "var(--font-body)",
};

export function OnboardingPage({ onSave }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    volume: "",
    width: "",
    height: "",
    depth: "",
    type: "Riff",
    setupDate: "",
    notes: "",
  });
  const [error, setError] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function handleNext() {
    if (!form.name.trim()) {
      setError("Bitte gib deinem Aquarium einen Namen.");
      return;
    }
    if (!form.volume || isNaN(form.volume) || Number(form.volume) <= 0) {
      setError("Bitte gib ein gültiges Volumen ein.");
      return;
    }
    setStep(2);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#071826",
        padding: "16px",
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: "56px", paddingBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "60px", lineHeight: "1", marginBottom: "20px" }}>🪸</div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-salt-mist)",
            fontSize: "22px",
            fontWeight: "600",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          Willkommen bei Atolliq
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-deep-mist)",
            fontSize: "14px",
          }}
        >
          Lass uns dein erstes Aquarium einrichten.
        </p>
      </div>

      {/* Step indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "36px" }}>
        {[1, 2].map((s) => (
          <div
            key={s}
            style={{
              width: "32px",
              height: "3px",
              borderRadius: "9999px",
              transition: "background-color 0.2s",
              backgroundColor:
                s <= step ? "var(--color-bioluminescent)" : "rgba(74, 122, 138, 0.25)",
            }}
          />
        ))}
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: "1" }}>
        {step === 1 && (
          <>
            <div>
              <label style={label}>Name des Aquariums *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="z.B. Wohnzimmer Riff"
                style={input}
              />
            </div>

            <div>
              <label style={label}>Volumen (Liter) *</label>
              <input
                type="number"
                value={form.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
                placeholder="z.B. 502"
                style={{ ...input, fontFamily: "var(--font-mono)" }}
              />
            </div>

            <div>
              <label style={label}>Beckentyp</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TANK_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChange("type", type)}
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      fontWeight: "500",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      backgroundColor:
                        form.type === type ? "rgba(29,206,138,0.15)" : "var(--color-deep)",
                      border:
                        form.type === type
                          ? "1px solid rgba(29,206,138,0.3)"
                          : "1px solid rgba(255,255,255,0.06)",
                      color:
                        form.type === type
                          ? "var(--color-bioluminescent)"
                          : "var(--color-deep-mist)",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: "var(--color-coral)", fontSize: "13px" }}>{error}</p>
            )}

            <button
              onClick={handleNext}
              style={{
                marginTop: "4px",
                width: "100%",
                padding: "14px",
                borderRadius: "16px",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: "var(--color-bioluminescent)",
                color: "#071826",
              }}
            >
              Weiter →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label style={label}>Beckengröße (optional)</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {["width", "height", "depth"].map((field, i) => (
                  <input
                    key={field}
                    type="number"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={["L", "B", "H"][i]}
                    style={{
                      ...input,
                      flex: "1",
                      padding: "12px 8px",
                      textAlign: "center",
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                ))}
                <span
                  style={{
                    color: "var(--color-deep-mist)",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    paddingLeft: "4px",
                  }}
                >
                  cm
                </span>
              </div>
            </div>

            <div>
              <label style={label}>Aufstelldatum (optional)</label>
              <input
                type="date"
                value={form.setupDate}
                onChange={(e) => handleChange("setupDate", e.target.value)}
                style={{ ...input, colorScheme: "dark" }}
              />
            </div>

            <div>
              <label style={label}>Notizen (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Besonderheiten, Ziele, Ideen..."
                rows={3}
                style={{ ...input, resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: "1",
                  padding: "14px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "var(--color-deep)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "var(--color-deep-mist)",
                }}
              >
                ← Zurück
              </button>
              <button
                onClick={() => onSave(form)}
                style={{
                  flex: "2",
                  padding: "14px",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "var(--color-bioluminescent)",
                  color: "#071826",
                }}
              >
                Aquarium anlegen 🪸
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
