import { useState } from "react";
import { createHabit } from "../../api/habit.js";

const inp = { width: "100%", background: "#0d0d0f", border: "1px solid rgba(39,39,42,0.9)", color: "#f4f4f5", borderRadius: 8, padding: "10px 13px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" };
const fo = e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.07)"; };
const bl = e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)"; e.currentTarget.style.boxShadow = "none"; };

export default function CreateCircleHabitModal({ circleId, onClose, onCreated }) {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setLoading(true); setError("");
    try {
      const res = await createHabit({ title, description, type: "circle", circleId });
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create habit");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 420, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.9)", borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,#ef4444 50%,transparent)" }} />
        <div style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: "#f4f4f5", margin: 0 }}>New Circle Habit</p>
              <p style={{ fontSize: 11, color: "#52525b", margin: "3px 0 0" }}>Daily habit for the circle</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(39,39,42,0.5)", border: "1px solid rgba(63,63,70,0.5)", color: "#71717a", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => e.currentTarget.style.color = "#f4f4f5"} onMouseLeave={e => e.currentTarget.style.color = "#71717a"}>×</button>
          </div>
          {error && <div style={{ marginBottom: 14, padding: "9px 13px", borderRadius: 8, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#52525b", marginBottom: 5 }}>Habit Title</p>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Daily DSA Practice" autoFocus style={inp} onFocus={fo} onBlur={bl} />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#52525b", marginBottom: 5 }}>Description (optional)</p>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What's this habit about?" rows={2}
                style={{ ...inp, resize: "none" }} onFocus={fo} onBlur={bl} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 12, border: "none", background: loading ? "rgba(249,115,22,0.4)" : "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Creating…" : "Create Habit →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}