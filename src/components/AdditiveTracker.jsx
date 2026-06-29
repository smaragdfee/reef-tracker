import { useState, useEffect } from "react";

const STORAGE_KEY = "atolliq_additives";

// ── helpers ──────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function calcReminderDate(dateAdded, duration, durationUnit) {
  if (!dateAdded || !duration || isNaN(Number(duration)) || Number(duration) <= 0) return "";
  const d = new Date(dateAdded);
  const n = Number(duration);
  if (durationUnit === "Tage")   d.setDate(d.getDate() + n);
  if (durationUnit === "Wochen") d.setDate(d.getDate() + n * 7);
  if (durationUnit === "Monate") d.setMonth(d.getMonth() + n);
  return d.toISOString().split("T")[0];
}

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  return Math.ceil((target - now) / 86400000);
}

function fmt(isoDate) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

function urgency(days) {
  if (days === null) return { color: "var(--color-deep-mist)", bg: "rgba(74,122,138,0.12)" };
  if (days < 3)  return { color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (days <= 7) return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  return { color: "var(--color-bioluminescent)", bg: "rgba(29,206,138,0.1)" };
}

function daysLabel(days) {
  if (days === null) return "—";
  if (days < 0)  return "Überfällig";
  if (days === 0) return "Heute";
  return `${days}d`;
}

// ── styles ────────────────────────────────────────────────────────────────────

const fieldLabel = {
  display: "block",
  marginBottom: "6px",
  fontFamily: "var(--font-heading)",
  color: "var(--color-deep-mist)",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
};

const textInput = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "var(--color-abyssal)",
  color: "var(--color-salt-mist)",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  outline: "none",
};

const selectInput = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "var(--color-abyssal)",
  color: "var(--color-salt-mist)",
  fontFamily: "var(--font-heading)",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  outline: "none",
  flexShrink: 0,
};

// ── sub-components ────────────────────────────────────────────────────────────

function AdditiveCard({ additive, onArchive }) {
  const days = daysUntil(additive.reminderDate);
  const { color, bg } = urgency(days);

  return (
    <div
      style={{
        backgroundColor: "var(--color-deep)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Name + days badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "-0.01em",
              marginBottom: additive.amount ? "3px" : 0,
            }}
          >
            {additive.name}
          </p>
          {additive.amount && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-deep-mist)",
                fontSize: "12px",
              }}
            >
              {additive.amount} {additive.unit}
            </p>
          )}
        </div>
        <div
          style={{
            backgroundColor: bg,
            borderRadius: "8px",
            padding: "4px 10px",
            flexShrink: 0,
            marginLeft: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color,
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            {daysLabel(days)}
          </span>
        </div>
      </div>

      {/* Date meta row */}
      <div style={{ display: "flex", gap: "0" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
            Hinzugefügt
          </p>
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-salt-mist)", fontSize: "12px" }}>
            {fmt(additive.dateAdded)}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            paddingLeft: "16px",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
            Fällig am
          </p>
          <p style={{ fontFamily: "var(--font-mono)", color, fontSize: "12px", fontWeight: "500" }}>
            {fmt(additive.reminderDate)}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            paddingLeft: "16px",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>
            Laufzeit
          </p>
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-salt-mist)", fontSize: "12px" }}>
            {additive.duration} {additive.durationUnit}
          </p>
        </div>
      </div>

      {additive.notes && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-deep-mist)",
            fontSize: "12px",
            fontStyle: "italic",
            paddingTop: "2px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {additive.notes}
        </p>
      )}

      <button
        onClick={() => onArchive(additive.id)}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "13px",
          fontWeight: "600",
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
          backgroundColor: "rgba(255,255,255,0.03)",
          color: "var(--color-deep-mist)",
        }}
      >
        ✓ Erledigt / Gewechselt
      </button>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const BLANK = {
  name: "",
  amount: "",
  unit: "g",
  dateAdded: todayISO(),
  duration: "",
  durationUnit: "Tage",
  notes: "",
};

export function AdditiveTracker() {
  const [additives, setAdditives] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAdditives(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(additives));
  }, [additives]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAdd() {
    if (!form.name.trim() || !form.duration) return;
    const reminderDate = calcReminderDate(form.dateAdded, form.duration, form.durationUnit);
    setAdditives((prev) => [
      {
        id: crypto.randomUUID(),
        ...form,
        reminderDate,
        archived: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setForm({ ...BLANK, dateAdded: todayISO() });
    setShowForm(false);
  }

  function handleArchive(id) {
    setAdditives((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, archived: true, archivedAt: new Date().toISOString() }
          : a
      )
    );
  }

  const active   = additives.filter((a) => !a.archived);
  const archived = additives.filter((a) =>  a.archived);

  const previewReminder = calcReminderDate(form.dateAdded, form.duration, form.durationUnit);
  const canSave = form.name.trim() && form.duration && Number(form.duration) > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "-0.01em",
            }}
          >
            Zusätze & Filtermedien
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "12px", marginTop: "2px" }}>
            {active.length === 0 ? "Keine aktiven Einträge" : `${active.length} aktiv`}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: "600",
            padding: "8px 14px",
            borderRadius: "10px",
            border: showForm ? "1px solid rgba(255,255,255,0.06)" : "none",
            cursor: "pointer",
            backgroundColor: showForm ? "var(--color-deep)" : "var(--color-bioluminescent)",
            color: showForm ? "var(--color-deep-mist)" : "#071826",
          }}
        >
          {showForm ? "Abbrechen" : "+ Hinzufügen"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div
          style={{
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Name */}
          <div>
            <label style={fieldLabel}>Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="z.B. Aktivkohle, Phosphatadsorber"
              style={textInput}
            />
          </div>

          {/* Amount + unit */}
          <div>
            <label style={fieldLabel}>Menge</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                style={{ ...textInput, fontFamily: "var(--font-mono)" }}
              />
              <select value={form.unit} onChange={(e) => set("unit", e.target.value)} style={selectInput}>
                {["g", "ml", "Stück"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Date added */}
          <div>
            <label style={fieldLabel}>Hinzugefügt am</label>
            <input
              type="date"
              value={form.dateAdded}
              onChange={(e) => set("dateAdded", e.target.value)}
              style={{ ...textInput, colorScheme: "dark" }}
            />
          </div>

          {/* Duration + unit */}
          <div>
            <label style={fieldLabel}>Laufzeit *</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="0"
                style={{ ...textInput, fontFamily: "var(--font-mono)" }}
              />
              <select value={form.durationUnit} onChange={(e) => set("durationUnit", e.target.value)} style={selectInput}>
                {["Tage", "Wochen", "Monate"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Auto-calculated reminder */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: previewReminder
                ? "rgba(29,206,138,0.06)"
                : "rgba(255,255,255,0.02)",
              border: previewReminder
                ? "1px solid rgba(29,206,138,0.15)"
                : "1px solid rgba(255,255,255,0.04)",
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-deep-mist)",
                fontSize: "12px",
              }}
            >
              Erinnerungsdatum
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                color: previewReminder
                  ? "var(--color-bioluminescent)"
                  : "var(--color-deep-mist)",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {previewReminder ? fmt(previewReminder) : "—"}
            </span>
          </div>

          {/* Notes */}
          <div>
            <label style={fieldLabel}>Notizen (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Marke, Beschaffenheit, Besonderheiten..."
              rows={2}
              style={{ ...textInput, resize: "none" }}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleAdd}
            disabled={!canSave}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              fontWeight: "600",
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              cursor: canSave ? "pointer" : "not-allowed",
              backgroundColor: canSave ? "var(--color-bioluminescent)" : "rgba(29,206,138,0.15)",
              color: canSave ? "#071826" : "var(--color-deep-mist)",
            }}
          >
            Eintrag speichern
          </button>
        </div>
      )}

      {/* Empty state */}
      {active.length === 0 && !showForm && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚗️</div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-salt-mist)",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "6px",
            }}
          >
            Noch keine Einträge
          </p>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "13px" }}>
            Füge deinen ersten Zusatz oder dein erstes Filtermedium hinzu.
          </p>
        </div>
      )}

      {/* Active cards */}
      {active.map((a) => (
        <AdditiveCard key={a.id} additive={a} onArchive={handleArchive} />
      ))}

      {/* Archive section */}
      {archived.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-deep-mist)",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Archiv ({archived.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {archived.map((a) => (
              <div
                key={a.id}
                style={{
                  backgroundColor: "rgba(12,45,64,0.4)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: 0.55,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-salt-mist)",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {a.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", color: "var(--color-deep-mist)", fontSize: "11px", marginTop: "2px" }}>
                    {a.amount ? `${a.amount} ${a.unit} · ` : ""}
                    Erledigt {fmt(a.archivedAt?.split("T")[0])}
                  </p>
                </div>
                <span style={{ color: "var(--color-bioluminescent)", fontSize: "15px" }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
