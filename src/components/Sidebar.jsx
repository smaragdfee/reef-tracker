const MENU_ITEMS = [
  { id: "dashboard",     icon: "🏠", label: "Dashboard" },
  { id: "test",          icon: "🧪", label: "Wassertest" },
  { id: "history",       icon: "📈", label: "Verlauf" },
  { id: "bestand",       icon: "🐠", label: "Bestand",      soon: true },
  { id: "technik",       icon: "🔧", label: "Technik",      soon: true },
  { id: "rechner",       icon: "⚗️",  label: "Rechner",      soon: true },
  { id: "erinnerungen",  icon: "🔔", label: "Erinnerungen", soon: true },
  { id: "einstellungen", icon: "⚙️",  label: "Einstellungen", soon: true },
];

export function Sidebar({ open, onClose, activeView, onNavigate }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(7,24,38,0.72)",
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "260px",
          backgroundColor: "#0C2D40",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🪸</span>
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
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-deep-mist)",
              fontSize: "16px",
              lineHeight: "1",
              padding: "4px 6px",
              borderRadius: "6px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {MENU_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "10px 12px",
                  marginBottom: "2px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: isActive ? "rgba(29,206,138,0.12)" : "transparent",
                  color: isActive ? "var(--color-bioluminescent)" : "var(--color-deep-mist)",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: "1", width: "20px", textAlign: "center" }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.soon && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: "600",
                      letterSpacing: "0.06em",
                      color: "var(--color-deep-mist)",
                      opacity: 0.5,
                    }}
                  >
                    BALD
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
