import { useState, useMemo } from "react";
import { SALT_PRODUCTS } from "../../data/faunaMarinProducts";

// ── shared styles ─────────────────────────────────────────────────────────────

const groupLabel = {
  fontFamily: "var(--font-heading)",
  color: "var(--color-deep-mist)",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "8px",
};

const card = {
  backgroundColor: "var(--color-deep)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "16px",
};

const baseInput = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  backgroundColor: "var(--color-abyssal)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "var(--color-salt-mist)",
  fontFamily: "var(--font-mono)",
  fontSize: "15px",
  outline: "none",
};

// ── product option ────────────────────────────────────────────────────────────

function ProductButton({ product, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        borderRadius: "10px",
        border: selected
          ? "1px solid rgba(29,206,138,0.35)"
          : "1px solid rgba(255,255,255,0.06)",
        backgroundColor: selected
          ? "rgba(29,206,138,0.06)"
          : "var(--color-abyssal)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-heading)",
            color: selected ? "var(--color-bioluminescent)" : "var(--color-salt-mist)",
            fontSize: "13px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-deep-mist)",
            fontSize: "11px",
            marginTop: "2px",
          }}
        >
          {product.brand} · {product.gramsPerLiter} g/L
        </p>
      </div>
      {selected && (
        <span
          style={{
            color: "var(--color-bioluminescent)",
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          ✓
        </span>
      )}
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function SaltCalculator() {
  const [volume, setVolume] = useState("");
  const [salinity, setSalinity] = useState("35");
  const [selectedId, setSelectedId] = useState(SALT_PRODUCTS[0].id);

  const product = SALT_PRODUCTS.find((p) => p.id === selectedId);

  const result = useMemo(() => {
    const vol = parseFloat(volume);
    const sal = parseFloat(salinity);
    if (!vol || vol <= 0 || !sal || sal <= 0 || !product) return null;
    return vol * product.gramsPerLiter * (sal / 35);
  }, [volume, salinity, product]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page title */}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-salt-mist)",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}
        >
          Salzrechner
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-deep-mist)",
            fontSize: "13px",
          }}
        >
          Berechne die benötigte Salzmenge für dein Aquarium.
        </p>
      </div>

      {/* Inputs */}
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Volume */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "8px",
              }}
            >
              <span style={groupLabel}>Wassermenge</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-deep-mist)",
                  fontSize: "11px",
                }}
              >
                Liter
              </span>
            </div>
            <input
              type="number"
              min="0"
              step="1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="z.B. 300"
              style={baseInput}
            />
          </div>

          {/* Salinity */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "8px",
              }}
            >
              <span style={groupLabel}>Zielsalzgehalt</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-deep-mist)",
                  fontSize: "11px",
                }}
              >
                ppt
              </span>
            </div>
            <input
              type="number"
              min="20"
              max="45"
              step="0.5"
              value={salinity}
              onChange={(e) => setSalinity(e.target.value)}
              style={baseInput}
            />
            {/* Salinity range ticks */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "6px",
                paddingInline: "2px",
              }}
            >
              {["30", "33", "35", "37", "40"].map((v) => (
                <button
                  key={v}
                  onClick={() => setSalinity(v)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color:
                      salinity === v
                        ? "var(--color-bioluminescent)"
                        : "var(--color-deep-mist)",
                    padding: "2px 4px",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product selector */}
      <div style={card}>
        <span style={{ ...groupLabel, marginBottom: "12px" }}>Salzprodukt</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SALT_PRODUCTS.map((p) => (
            <ProductButton
              key={p.id}
              product={p}
              selected={selectedId === p.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      {/* Result */}
      <div
        style={{
          ...card,
          backgroundColor: result
            ? "rgba(29,206,138,0.05)"
            : "var(--color-deep)",
          border: result
            ? "1px solid rgba(29,206,138,0.2)"
            : "1px solid rgba(255,255,255,0.06)",
          transition: "border-color 0.2s, background-color 0.2s",
        }}
      >
        <span style={{ ...groupLabel, marginBottom: "12px" }}>Benötigtes Salz</span>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "10px",
            padding: "12px 0 8px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "48px",
              fontWeight: "700",
              color: result ? "var(--color-bioluminescent)" : "rgba(74,122,138,0.3)",
              lineHeight: "1",
              letterSpacing: "-0.03em",
              transition: "color 0.2s",
            }}
          >
            {result != null ? result.toFixed(0) : "—"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "20px",
              color: result ? "rgba(29,206,138,0.6)" : "rgba(74,122,138,0.2)",
              fontWeight: "500",
              transition: "color 0.2s",
            }}
          >
            g
          </span>
        </div>

        {result != null && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-deep-mist)",
              fontSize: "12px",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            {product.name} · {volume} L · {salinity} ppt
          </p>
        )}

        {result != null && result > 1000 && (
          <div
            style={{
              marginTop: "14px",
              padding: "10px 14px",
              backgroundColor: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "10px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-amber)",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {(result / 1000).toFixed(2)} kg · in mehreren Schritten auflösen
            </p>
          </div>
        )}
      </div>

      {/* Formula note */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          color: "rgba(74,122,138,0.5)",
          fontSize: "11px",
          textAlign: "center",
          paddingBottom: "8px",
        }}
      >
        Formel: Liter × g/L × (Ziel-ppt ÷ 35)
      </p>
    </div>
  );
}
