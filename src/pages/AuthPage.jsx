import { useState } from "react";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  backgroundColor: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  color: "var(--color-salt-mist)",
  fontSize: "14px",
  fontFamily: "var(--font-body)",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontFamily: "var(--font-body)",
  color: "var(--color-deep-mist)",
  marginBottom: "6px",
  fontWeight: "500",
};

export function AuthPage({ signIn, signUp }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function switchMode(m) {
    setMode(m);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        const data = await signUp(email, password);
        if (!data?.session) {
          setInfo("Bitte bestätige deine E-Mail-Adresse, dann kannst du dich anmelden.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-abyssal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "52px" }}>🪸</span>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
              fontSize: "22px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              marginTop: "8px",
            }}
          >
            Atolliq
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-deep-mist)",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Dein Riffaquarium-Tagebuch
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "var(--color-deep)",
            borderRadius: "16px",
            padding: "28px 24px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "10px",
              padding: "3px",
              marginBottom: "24px",
            }}
          >
            {[
              { id: "login", label: "Anmelden" },
              { id: "register", label: "Registrieren" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => switchMode(id)}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  fontWeight: "600",
                  transition: "all 0.15s",
                  backgroundColor:
                    mode === id ? "var(--color-bioluminescent)" : "transparent",
                  color: mode === id ? "#071826" : "var(--color-deep-mist)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <label style={labelStyle}>E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="deine@email.de"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                style={inputStyle}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "8px",
                  color: "var(--color-danger)",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                }}
              >
                {error}
              </div>
            )}

            {info && (
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "rgba(29,206,138,0.1)",
                  border: "1px solid rgba(29,206,138,0.25)",
                  borderRadius: "8px",
                  color: "var(--color-bioluminescent)",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                }}
              >
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "var(--color-bioluminescent)",
                color: "#071826",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "var(--font-heading)",
                fontWeight: "700",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                marginTop: "4px",
                letterSpacing: "-0.01em",
              }}
            >
              {submitting
                ? "..."
                : mode === "login"
                ? "Anmelden"
                : "Konto erstellen"}
            </button>
          </form>

          {mode === "register" && (
            <p
              style={{
                marginTop: "16px",
                textAlign: "center",
                fontSize: "12px",
                fontFamily: "var(--font-body)",
                color: "var(--color-deep-mist)",
              }}
            >
              Mit der Registrierung stimmst du unseren Nutzungsbedingungen zu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
