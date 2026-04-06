import { useState } from "react";
import { fetchTodayHabitStatuses, postHabitCheckIn } from "../../api/checkIn.js";
import { useEffect } from "react";

function HabitCard({ habit, userId, onJoin, onLeave }) {
  const [loading,   setLoading]   = useState(false);
  const [hovered,   setHovered]   = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checking,  setChecking]  = useState(false);

  const isJoined  = (habit.members || []).some(m => (m._id || m)?.toString() === userId?.toString());
  const isCreator = (habit.createdBy?._id || habit.createdBy)?.toString() === userId?.toString();

  useEffect(() => {
    fetchTodayHabitStatuses()
      .then(r => setCheckedIn(!!r.data.data[habit._id]))
      .catch(console.log);
  }, [habit._id]);

  const handle = async (fn) => {
    setLoading(true);
    try { await fn(habit._id); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const handleCheckIn = async (e) => {
    e.stopPropagation();
    if (checking || !isJoined) return;
    setChecking(true);
    try {
      await postHabitCheckIn(habit._id);
      setCheckedIn(v => !v);
    } catch (e) { console.log(e); }
    finally { setChecking(false); }
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 14, overflow: "hidden", background: "linear-gradient(145deg,#111113,#0d0d0f)", border: `1px solid ${hovered ? "rgba(249,115,22,0.2)" : "rgba(39,39,42,0.8)"}`, transition: "all 0.22s", transform: hovered ? "translateY(-1px)" : "translateY(0)" }}>
      <div style={{ height: 2, background: checkedIn ? "linear-gradient(90deg,#22c55e,transparent)" : "linear-gradient(90deg,#f97316,#ef4444,transparent)" }} />
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 14, color: "#f4f4f5", margin: "0 0 4px" }}>{habit.title}</h3>
            {habit.description && <p style={{ fontSize: 12, color: "#52525b", margin: "0 0 8px", lineHeight: 1.5 }}>{habit.description}</p>}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {isJoined && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", color: "#22c55e" }}>✓ Joined</span>}
              <span style={{ fontSize: 9, color: "#3f3f46", padding: "2px 7px" }}>👥 {habit.members?.length || 0}</span>
              {habit.streak > 0 && <span style={{ fontSize: 9, color: "#f97316", padding: "2px 7px" }}>🔥 {habit.streak}d streak</span>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {/* Check-in */}
            {isJoined && (
              <button onClick={handleCheckIn} disabled={checking}
                style={{ width: 32, height: 32, borderRadius: 9, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.18s", background: checkedIn ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(249,115,22,0.1)", opacity: checking ? 0.5 : 1 }}>
                {checking
                  ? <div style={{ width: 10, height: 10, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  : <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke={checkedIn ? "white" : "#f97316"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                }
              </button>
            )}

            {/* Join/Leave */}
            {!isCreator && (
              <button onClick={() => handle(isJoined ? onLeave : onJoin)} disabled={loading}
                style={{ padding: "5px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.5 : 1, transition: "all 0.15s", background: isJoined ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.1)", color: isJoined ? "#f87171" : "#22c55e" }}>
                {loading ? "…" : isJoined ? "Leave" : "Join"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CircleHabitSection({ habits, userId, onJoin, onLeave, onCreateHabit }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#f4f4f5", margin: "0 0 4px" }}>Circle Habits</h2>
          <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>Daily habits to do together</p>
        </div>
        <button onClick={onCreateHabit}
          style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          + New Habit
        </button>
      </div>

      {habits.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", borderRadius: 14, border: "1px dashed rgba(39,39,42,0.7)" }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🔥</p>
          <p style={{ fontSize: 13, color: "#52525b", marginBottom: 12 }}>No habits yet. Start one for the circle!</p>
          <button onClick={onCreateHabit} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Create Habit</button>
        </div>
      )}

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr" }}>
        {habits.map(h => <HabitCard key={h._id} habit={h} userId={userId} onJoin={onJoin} onLeave={onLeave} />)}
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}