import { useState } from "react";

export function AquariumSelector({ aquariums, activeAquarium, onSelect, onAdd }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-left">
          <p
            className="text-sm font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
            }}
          >
            {activeAquarium?.name || "Kein Aquarium"}
          </p>
          <p
            className="text-xs leading-tight"
            style={{ color: "var(--color-deep-mist)" }}
          >
            {activeAquarium?.volume
              ? `${activeAquarium.volume} Liter · ${activeAquarium.type}`
              : ""}
          </p>
        </div>
        <span
          className="text-xs ml-1"
          style={{ color: "var(--color-deep-mist)" }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 rounded-2xl overflow-hidden z-50 min-w-56"
          style={{
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {aquariums.map((aq) => (
            <button
              key={aq.id}
              onClick={() => {
                onSelect(aq.id);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left flex items-center justify-between transition-all"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                backgroundColor:
                  aq.id === activeAquarium?.id
                    ? "rgba(29,206,138,0.08)"
                    : "transparent",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color:
                      aq.id === activeAquarium?.id
                        ? "var(--color-bioluminescent)"
                        : "var(--color-salt-mist)",
                  }}
                >
                  {aq.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-deep-mist)" }}
                >
                  {aq.volume} Liter · {aq.type}
                </p>
              </div>
              {aq.id === activeAquarium?.id && (
                <span style={{ color: "var(--color-bioluminescent)" }}>✓</span>
              )}
            </button>
          ))}

          <button
            onClick={() => {
              onAdd();
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium transition-all"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-bioluminescent)",
            }}
          >
            + Neues Aquarium anlegen
          </button>
        </div>
      )}
    </div>
  );
}