import { useState, useEffect } from "react";
import { createGoal } from "../../api/goal.js";
import { getUserCircles } from "../../api/circle.js";

const Label = ({ children }) => (
  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#52525b", marginBottom: 6 }}>{children}</p>
);

const InputStyle = {
  width: "100%", background: "#0d0d0f", border: "1px solid rgba(39,39,42,0.9)",
  color: "#f4f4f5", borderRadius: 10, padding: "11px 14px", fontSize: 13,
  fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function CreateGoalModal({ onClose, onCreated }) {
  const [title,     setTitle]     = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate,   setEndDate]   = useState("");
  const [type,      setType]      = useState("personal");
  const [circleId,  setCircleId]  = useState("");
  const [circles,   setCircles]   = useState([]);
  const [resources, setResources] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    getUserCircles().then(r => setCircles(r.data.data)).catch(console.log);
  }, []);

  const addResource    = () => setResources(p => [...p, { name: "", url: "" }]);
  const updateRes      = (i, f, v) => setResources(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const removeRes      = (i) => setResources(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !endDate) { setError("Title and end date are required"); return; }
    if (type === "circle" && !circleId) { setError("Please select a circle"); return; }
    setLoading(true); setError("");
    try {
      const res = await createGoal({
        title, startDate, endDate, type,
        circleId: type === "circle" ? circleId : undefined,
        resources: resources.filter(r => r.name.trim() && r.url.trim()),
      });
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal");
    } finally { setLoading(false); }
  };

  const focusStyle = e => {
    e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(249,115,22,0.07)";
  };
  const blurStyle = e => {
    e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)";
    e.currentTarget.style.boxShadow   = "none";
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 500, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.9)", borderRadius: 18, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>

        {/* Top accent */}
        <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,#ef4444 50%,transparent)", flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "22px 26px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 17, color: "#f4f4f5", margin: 0 }}>New Goal</p>
              <p style={{ fontSize: 11, color: "#52525b", margin: "3px 0 0" }}>Set a target and start tracking</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(39,39,42,0.5)", border: "1px solid rgba(63,63,70,0.5)", color: "#71717a", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f4f4f5"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#71717a"; }}>×</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: "0 26px 26px", overflowY: "auto", flex: 1 }}>
          {error && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="6" cy="6" r="5.5" stroke="#f87171" strokeWidth="1"/>
                <path d="M6 3.5v3M6 8.5h.01" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <Field label="Goal Title">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Learn MERN Stack"
                autoFocus required style={InputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Start Date">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  required style={InputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="End Date">
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  required style={InputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>

            <Field label="Type">
              <div style={{ display: "flex", gap: 8 }}>
                {["personal", "circle"].map(t => (
                  <button key={t} type="button" onClick={() => { setType(t); if (t === "personal") setCircleId(""); }}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.18s", textTransform: "capitalize",
                      background: type === t ? "rgba(249,115,22,0.12)" : "rgba(15,15,17,0.8)",
                      border: type === t ? "1px solid rgba(249,115,22,0.45)" : "1px solid rgba(39,39,42,0.9)",
                      color: type === t ? "#f97316" : "#71717a",
                    }}>
                    {t === "personal" ? "👤 Personal" : "⭕ Circle"}
                  </button>
                ))}
              </div>
            </Field>

            {type === "circle" && (
              <Field label="Select Circle">
                {circles.length === 0
                  ? <p style={{ fontSize: 12, color: "#52525b", padding: "10px 14px", background: "rgba(15,15,17,0.8)", borderRadius: 10, border: "1px solid rgba(39,39,42,0.9)" }}>No circles found. Create or join one first.</p>
                  : <select value={circleId} onChange={e => setCircleId(e.target.value)} required
                      style={{ ...InputStyle, cursor: "pointer" }} onFocus={focusStyle} onBlur={blurStyle}>
                      <option value="">Choose a circle…</option>
                      {circles.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                    </select>
                }
              </Field>
            )}

            {/* Resources */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Label>Resources</Label>
                <button type="button" onClick={addResource}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#f97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(249,115,22,0.08)"}>
                  + Add
                </button>
              </div>

              {resources.length === 0 && (
                <div style={{ padding: "14px", borderRadius: 10, border: "1px dashed rgba(39,39,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#3f3f46" }}>No resources — click Add to attach links</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {resources.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input value={r.name} onChange={e => updateRes(i, "name", e.target.value)}
                      placeholder="Name (e.g. Frontend Course)" style={{ ...InputStyle, flex: "0 0 38%", fontSize: 12, padding: "9px 12px" }} onFocus={focusStyle} onBlur={blurStyle} />
                    <input value={r.url} onChange={e => updateRes(i, "url", e.target.value)}
                      placeholder="https://..." style={{ ...InputStyle, flex: 1, fontSize: 12, padding: "9px 12px" }} onFocus={focusStyle} onBlur={blurStyle} />
                    <button type="button" onClick={() => removeRes(i)}
                      style={{ flexShrink: 0, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {type === "circle" && (
              <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.12)", display: "flex", gap: 8 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>ℹ️</span>
                <p style={{ fontSize: 12, color: "#a16207", lineHeight: 1.6, margin: 0 }}>
                  Circle goals require peer verification. You'll submit proof when marking complete — circle members will vote to approve.
                </p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding: "13px", borderRadius: 12, border: "none", background: loading ? "rgba(249,115,22,0.4)" : "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s, transform 0.1s", letterSpacing: "0.01em" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.985)"; }}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              {loading ? "Creating…" : "Create Goal →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}