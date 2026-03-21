import { useState, useEffect } from "react";
import { getUserCircles } from "../../api/circle.js";
import { linkHabitToCircle } from "../../api/habit.js";

export default function LinkCircleModal({ habit, onClose, onLinked }) {
  const [circles,   setCircles]   = useState([]);
  const [circleId,  setCircleId]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    getUserCircles()
      .then(r => setCircles(r.data.data))
      .catch(console.log)
      .finally(() => setFetching(false));
  }, []);

  const handleLink = async () => {
    if (!circleId) return;
    setLoading(true); setError("");
    try {
      const res = await linkHabitToCircle(habit._id, { circleId });
      onLinked(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to link habit");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 420, background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(63,63,70,0.8)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />
        <div style={{ padding: 24 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
                Link to Circle
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Share <span style={{ color: "#f97316", fontWeight: 600 }}>{habit.title}</span> with your circle. All circle members will be able to join and track it together.
              </p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1, flexShrink: 0, marginLeft: 12 }}>×</button>
          </div>

          {/* Your history stays */}
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              <p style={{ fontSize: 12, color: "#fb923c", fontWeight: 600 }}>Your check-in history is preserved</p>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4, marginLeft: 22 }}>
              All your past check-ins and streak data stay intact after linking.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 14, padding: "8px 12px", borderRadius: 8, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12 }}>
              {error}
            </div>
          )}

          {/* Circle picker */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-faint)" }}>
              Select Circle
            </label>

            {fetching ? (
              <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-faint)", fontSize: 12 }}>
                Loading circles…
              </div>
            ) : circles.length === 0 ? (
              <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-faint)", fontSize: 12 }}>
                You're not in any circles yet. Create or join one first.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {circles.map(c => {
                  const selected = circleId === c._id;
                  const hue = c.name.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
                  return (
                    <button key={c._id} onClick={() => setCircleId(c._id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                        background: selected ? "rgba(249,115,22,0.07)" : "var(--bg-input)",
                        border: selected ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(63,63,70,0.5)",
                        transition: "all 0.15s", textAlign: "left",
                      }}>
                      {/* Circle avatar */}
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 12,
                        background: `hsla(${hue},60%,45%,0.2)`,
                        border: `1px solid hsla(${hue},60%,50%,0.3)`,
                        color: `hsl(${hue},70%,65%)`,
                      }}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: selected ? "var(--text-primary)" : "var(--text-secondary)", margin: 0 }}>
                          {c.name}
                        </p>
                        <p style={{ fontSize: 10, color: "var(--text-faint)", margin: 0, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em" }}>
                          {c.code} · {c.members?.length || 0} members
                        </p>
                      </div>
                      {selected && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M2 7l3.5 3.5L12 3" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose}
              style={{ flex: 1, padding: 11, borderRadius: 10, border: "1px solid rgba(63,63,70,0.5)", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleLink} disabled={!circleId || loading || circles.length === 0}
              style={{
                flex: 1, padding: 11, borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white",
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
                cursor: !circleId || loading ? "not-allowed" : "pointer",
                opacity: !circleId || loading ? 0.45 : 1, transition: "opacity 0.2s",
              }}>
              {loading ? "Linking…" : "Link to Circle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}