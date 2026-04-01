import { useState, useEffect } from "react";
import { createGoal } from "../../api/goal.js";
import { getUserCircles } from "../../api/circle.js";

const inp = {
  background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.6)",
  color: "var(--text-primary)", borderRadius: 8, padding: "10px 13px",
  fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none",
  width: "100%", boxSizing: "border-box", transition: "border-color 0.2s",
};
const fo = e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
const bl = e => e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)";
const Lbl = ({ c }) => (
  <label style={{ display: "block", marginBottom: 5, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-faint)" }}>{c}</label>
);

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

  const addResource    = ()          => setResources(p => [...p, { name: "", url: "" }]);
  const updateResource = (i, f, v)   => setResources(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const removeResource = (i)         => setResources(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !endDate) return;
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

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 480, background: "linear-gradient(145deg,#111113,#0e0e10)", border: "1px solid rgba(63,63,70,0.8)", borderRadius: 16, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)", flexShrink: 0 }} />

        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 17, color: "var(--text-primary)" }}>New Goal</p>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>

          {error && (
            <div style={{ marginBottom: 14, padding: "9px 13px", borderRadius: 8, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Title */}
            <div>
              <Lbl c="Goal Title" />
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Learn MERN Stack"
                autoFocus required style={inp} onFocus={fo} onBlur={bl} />
            </div>

            {/* Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <Lbl c="Start Date" />
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={inp} onFocus={fo} onBlur={bl} />
              </div>
              <div>
                <Lbl c="End Date" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={inp} onFocus={fo} onBlur={bl} />
              </div>
            </div>

            {/* Type */}
            <div>
              <Lbl c="Type" />
              <div style={{ display: "flex", gap: 8 }}>
                {["personal", "circle"].map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    style={{ flex: 1, padding: "9px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize", background: type === t ? "rgba(249,115,22,0.1)" : "var(--bg-input)", border: type === t ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(63,63,70,0.5)", color: type === t ? "#f97316" : "var(--text-muted)" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Circle selector */}
            {type === "circle" && (
              <div>
                <Lbl c="Circle" />
                <select value={circleId} onChange={e => setCircleId(e.target.value)} required
                  style={{ ...inp, cursor: "pointer" }}>
                  <option value="">Select a circle…</option>
                  {circles.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {/* Resources */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Lbl c="Resources (optional)" />
                <button type="button" onClick={addResource}
                  style={{ fontSize: 11, color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                  + Add
                </button>
              </div>
              {resources.length === 0 && (
                <p style={{ fontSize: 11, color: "var(--text-ghost)", fontStyle: "italic" }}>No resources added — click + Add to attach links</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {resources.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr auto", gap: 6, alignItems: "center" }}>
                    <input value={r.name} onChange={e => updateResource(i, "name", e.target.value)}
                      placeholder="Label (e.g. Frontend Course)" style={{ ...inp, fontSize: 12 }} onFocus={fo} onBlur={bl} />
                    <input value={r.url} onChange={e => updateResource(i, "url", e.target.value)}
                      placeholder="https://..." style={{ ...inp, fontSize: 12 }} onFocus={fo} onBlur={bl} />
                    <button type="button" onClick={() => removeResource(i)}
                      style={{ background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint for circle */}
            {type === "circle" && (
              <div style={{ padding: "10px 13px", borderRadius: 8, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", fontSize: 12, color: "#fb923c", lineHeight: 1.6 }}>
                ℹ️ Circle goals require peer verification — you'll need to submit proof when marking complete.
              </div>
            )}

            <button type="submit" disabled={loading || !title.trim() || !endDate}
              style={{ padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, transition: "opacity 0.2s", marginTop: 4 }}>
              {loading ? "Creating…" : "Create Goal →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}