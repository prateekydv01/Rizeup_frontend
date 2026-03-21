import { useState } from "react";
import HabitGraph from "./HabitGraph.jsx";
import EditHabitModal from "./EditHabitModal.jsx";
import LinkCircleModal from "./LinkCIrcleModal.jsx";
import { unlinkHabitFromCircle } from "../../api/habit.js";

export default function HabitCard({ habit: initialHabit, checkedIn, onCheckIn, onDelete, onLeave, onHabitUpdate, isCreator }) {
  const [habit,       setHabit]       = useState(initialHabit);
  const [checking,    setChecking]    = useState(false);
  const [showEdit,    setShowEdit]    = useState(false);
  const [showLink,    setShowLink]    = useState(false);
  const [unlinking,   setUnlinking]   = useState(false);
  // Real-time dates — updated immediately on check-in without refetch
  const [graphDates, setGraphDates] = useState(null);

  const todayStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleCheckIn = async (e) => {
    e.stopPropagation();
    if (checking) return;
    setChecking(true);
    try {
      const result = await onCheckIn(habit._id);
      const isChecked = result?.checkedIn;
      const today = todayStr();
      // Update graph dates in real-time
      setGraphDates(prev => {
        const current = prev || [];
        if (isChecked) {
          return current.includes(today) ? current : [...current, today];
        } else {
          return current.filter(d => d !== today);
        }
      });
      // Update streak
      if (result?.streak !== undefined) {
        setHabit(h => ({ ...h, streak: result.streak }));
      }
    } finally { setChecking(false); }
  };

  const handleUnlink = async () => {
    if (unlinking) return;
    setUnlinking(true);
    try {
      const res = await unlinkHabitFromCircle(habit._id);
      const updated = res.data.data;
      setHabit(updated);
      if (onHabitUpdate) onHabitUpdate(updated);
    } catch (e) { console.log(e); }
    finally { setUnlinking(false); }
  };

  return (
    <>
      <div style={{
        borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s",
        background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))",
        border: "1px solid rgba(39,39,42,0.9)",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(63,63,70,0.7)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)"}>

        {/* Top accent — green if checked in today */}
        <div style={{ height: 2, background: checkedIn ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

        <div style={{ padding: "16px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>
                  {habit.title}
                </p>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "2px 8px", borderRadius: 20,
                  background: habit.type === "circle" ? "rgba(249,115,22,0.1)" : "rgba(63,63,70,0.3)",
                  border: habit.type === "circle" ? "1px solid rgba(249,115,22,0.25)" : "1px solid rgba(63,63,70,0.4)",
                  color: habit.type === "circle" ? "#f97316" : "var(--text-faint)",
                }}>
                  {habit.type === "circle" ? (habit.circleId?.name || "Circle") : "Personal"}
                </span>
              </div>
              {habit.description && (
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>{habit.description}</p>
              )}
            </div>

            {/* Check-in button */}
            <button onClick={handleCheckIn} disabled={checking}
              title={checkedIn ? "Checked in today" : "Check in"}
              style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: 10, border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: checkedIn ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(249,115,22,0.1)",
                border: checkedIn ? "1px solid transparent" : "1px solid rgba(249,115,22,0.3)",
                cursor: checking ? "not-allowed" : "pointer",
                transition: "all 0.2s", transform: checking ? "scale(0.88)" : "scale(1)",
              }}>
              {checking
                ? <div style={{ width: 12, height: 12, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                : <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3" stroke={checkedIn ? "white" : "#f97316"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </button>
          </div>

          {/* Streak row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(39,39,42,0.6)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f97316", fontFamily: "'Syne',sans-serif" }}>{habit.streak || 0}</span>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>day streak</span>
            </div>
            {checkedIn && (
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Done today
              </span>
            )}
            {habit.type === "circle" && habit.members && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{habit.members.length} members</span>
              </div>
            )}
          </div>

          {/* Contribution graph — always visible */}
          <HabitGraph
            habitId={habit._id}
            type={habit.type}
            localDates={graphDates}
            onDatesChange={(d) => setGraphDates(d)}
          />

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", minWidth: 0 }}>
            {isCreator && (
              <button onClick={() => setShowEdit(true)}
                style={{
                  flex: 1, padding: "7px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
                  background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-muted)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)"; e.currentTarget.style.color = "#f97316"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.5)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                Edit
              </button>
            )}

            {/* Link to circle — only for personal habits created by user */}
            {isCreator && habit.type === "personal" && (
              <button onClick={() => setShowLink(true)}
                style={{
                  flex: 1, padding: "7px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
                  background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.25)", color: "#f97316",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.07)"; }}>
                Link Circle
              </button>
            )}

            {/* Unlink from circle — only for circle habits created by user */}
            {isCreator && habit.type === "circle" && (
              <button onClick={handleUnlink} disabled={unlinking}
                style={{
                  flex: 1, padding: "7px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: unlinking ? "not-allowed" : "pointer", transition: "all 0.15s",
                  background: "transparent", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-faint)",
                  opacity: unlinking ? 0.5 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(113,113,122,0.6)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.5)"; e.currentTarget.style.color = "var(--text-faint)"; }}>
                {unlinking ? "Unlinking…" : "Unlink"}
              </button>
            )}

            {isCreator ? (
              <button onClick={() => onDelete(habit._id)}
                style={{
                  flex: 1, padding: "7px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#dc2626"; }}>
                Delete
              </button>
            ) : (
              <button onClick={() => onLeave(habit._id)}
                style={{
                  flex: 1, padding: "7px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s",
                  background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-muted)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}>
                Leave
              </button>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => { setHabit(updated); if (onHabitUpdate) onHabitUpdate(updated); setShowEdit(false); }}
        />
      )}

      {showLink && (
        <LinkCircleModal
          habit={habit}
          onClose={() => setShowLink(false)}
          onLinked={(updated) => { setHabit(updated); if (onHabitUpdate) onHabitUpdate(updated); setShowLink(false); }}
        />
      )}
    </>
  );
}