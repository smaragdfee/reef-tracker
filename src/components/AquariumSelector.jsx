import { useState, useEffect, useRef } from "react";

export function AquariumSelector({ aquariums, activeAquarium, onSelect, onAdd }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: open ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          cursor: "pointer",
          transition: "background-color 0.15s",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "1.25",
              whiteSpace: "nowrap",
            }}
          >
            {activeAquarium?.name ?? "Kein Aquarium"}
          </p>
          {activeAquarium?.volume && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-deep-mist)",
                fontSize: "11px",
                lineHeight: "1.25",
                whiteSpace: "nowrap",
              }}
            >
              {activeAquarium.volume} L · {activeAquarium.type}
            </p>
          )}
        </div>
        <span
          style={{
            color: "var(--color-deep-mist)",
            fontSize: "9px",
            flexShrink: 0,
            marginLeft: "2px",
            transition: "transform 0.15s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: "220px",
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
            zIndex: 30,
          }}
        >
          {aquariums.length > 0 && (
            <div style={{ padding: "6px" }}>
              {aquariums.map((aq) => {
                const isActive = aq.id === activeAquarium?.id;
                return (
                  <button
                    key={aq.id}
                    onClick={() => { onSelect(aq.id); setOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      backgroundColor: isActive ? "rgba(29,206,138,0.1)" : "transparent",
                      transition: "background-color 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: isActive ? "var(--color-bioluminescent)" : "var(--color-salt-mist)",
                          fontSize: "13px",
                          fontWeight: "600",
                          lineHeight: "1.3",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {aq.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          color: "var(--color-deep-mist)",
                          fontSize: "11px",
                          lineHeight: "1.3",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {aq.volume} Liter · {aq.type}
                      </p>
                    </div>
                    {isActive && (
                      <span style={{ color: "var(--color-bioluminescent)", fontSize: "13px", marginLeft: "12px", flexShrink: 0 }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Divider + Add button */}
          <div
            style={{
              borderTop: aquariums.length > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
              padding: "6px",
            }}
          >
            <button
              onClick={() => { onAdd(); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                backgroundColor: "transparent",
                fontFamily: "var(--font-heading)",
                color: "var(--color-bioluminescent)",
                fontSize: "13px",
                fontWeight: "600",
                whiteSpace: "nowrap",
                transition: "background-color 0.12s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(29,206,138,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <span style={{ fontSize: "15px", lineHeight: "1" }}>+</span>
              Neues Aquarium anlegen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
