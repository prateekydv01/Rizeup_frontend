import { useState } from "react";
import { updateHabit } from "../../api/habit.js";

export default function EditHabitModal({ habit, onClose, onUpdated }) {
  const [title,       setTitle]       = useState(habit.title);
  const [description, setDescription] = useState(habit.description || "");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await updateHabit(habit._id, { title, description });
      onUpdated(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update habit");
    } finally { setLoading(false); }
  };

  const inp = {
    background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.6)",
    color: "var(--text-primary)", borderRadius: 10, padding: "10px 14px",
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none",
    width: "100%", boxSizing: "border-box", transition: "border-color 0.2s",
  };
  const fo = e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
  const bl = e => e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 420, background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(63,63,70,0.8)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: "var(--text-primary)" }}>Edit Habit</p>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>

          {error && (
            <div style={{ marginBottom: 14, padding: "8px 12px", borderRadius: 8, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-faint)" }}>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Daily DSA" autoFocus required
                style={inp} onFocus={fo} onBlur={bl} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-faint)" }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe your habit…" rows={2}
                style={{ ...inp, resize: "none" }} onFocus={fo} onBlur={bl} />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button type="button" onClick={onClose}
                style={{ flex: 1, padding: 11, borderRadius: 10, border: "1px solid rgba(63,63,70,0.5)", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={loading || !title.trim()}
                style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}>
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}