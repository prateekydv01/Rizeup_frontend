import { useState } from "react";
import { createGoal } from "../../api/goal.js";

const inp = { width: "100%", background: "#0d0d0f", border: "1px solid rgba(39,39,42,0.9)", color: "#f4f4f5", borderRadius: 8, padding: "10px 13px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" };
const fo = e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.07)"; };
const bl = e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)"; e.currentTarget.style.boxShadow = "none"; };
const Lbl = ({ c }) => <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#52525b", marginBottom: 5 }}>{c}</p>;

export default function CreateCircleGoalModal({ circleId, onClose, onCreated }) {
  const [title,     setTitle]     = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate,   setEndDate]   = useState("");
  const [resources, setResources] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const addRes    = () => setResources(p => [...p, { name: "", url: "" }]);
  const updateRes = (i, f, v) => setResources(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const removeRes = (i) => setResources(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !endDate) { setError("Title and end date are required"); return; }
    setLoading(true); setError("");
    try {
      const res = await createGoal({ title, startDate, endDate, type: "circle", circleId, resources: resources.filter(r => r.name.trim() && r.url.trim()) });
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 460, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.9)", borderRadius: 18, overflow: "hidden", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,#ef4444 50%,transparent)", flexShrink: 0 }} />
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: "#f4f4f5", margin: 0 }}>New Circle Goal</p>
              <p style={{ fontSize: 11, color: "#52525b", margin: "3px 0 0" }}>Shared goal for the circle</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(39,39,42,0.5)", border: "1px solid rgba(63,63,70,0.5)", color: "#71717a", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => e.currentTarget.style.color = "#f4f4f5"} onMouseLeave={e => e.currentTarget.style.color = "#71717a"}>×</button>
          </div>
          {error && <div style={{ marginBottom: 14, padding: "9px 13px", borderRadius: 8, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><Lbl c="Title" /><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Learn MERN Stack" autoFocus style={inp} onFocus={fo} onBlur={bl} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><Lbl c="Start Date" /><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inp} onFocus={fo} onBlur={bl} /></div>
              <div><Lbl c="End Date" /><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={inp} onFocus={fo} onBlur={bl} /></div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Lbl c="Resources (optional)" />
                <button type="button" onClick={addRes} style={{ fontSize: 11, color: "#f97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 6, padding: "2px 10px", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
              </div>
              {resources.length === 0 && <p style={{ fontSize: 11, color: "#3f3f46" }}>No resources — click Add to attach links</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {resources.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input value={r.name} onChange={e => updateRes(i, "name", e.target.value)} placeholder="Name" style={{ ...inp, flex: "0 0 35%", fontSize: 12, padding: "8px 11px" }} onFocus={fo} onBlur={bl} />
                    <input value={r.url} onChange={e => updateRes(i, "url", e.target.value)} placeholder="URL" style={{ ...inp, flex: 1, fontSize: 12, padding: "8px 11px" }} onFocus={fo} onBlur={bl} />
                    <button type="button" onClick={() => removeRes(i)} style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", width: 30, height: 30, borderRadius: 8, cursor: "pointer", flexShrink: 0, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 12, border: "none", background: loading ? "rgba(249,115,22,0.4)" : "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}>
              {loading ? "Creating…" : "Create Goal →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}