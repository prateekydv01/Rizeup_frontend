import { useState } from "react";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

function GoalCard({ goal, userId, onJoin, onLeave }) {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isJoined    = goal.isJoined || (goal.members || []).some(m => (m._id || m)?.toString() === userId?.toString());
  const isCreator   = (goal.createdBy?._id || goal.createdBy)?.toString() === userId?.toString();
  const isCompleted = (goal.completedBy || []).some(c => (c.userId?._id || c.userId)?.toString() === userId?.toString());

  const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / 86400000);
  const totalMs  = new Date(goal.endDate) - new Date(goal.startDate);
  const passedMs = new Date() - new Date(goal.startDate);
  const pct      = Math.min(100, Math.max(0, Math.round((passedMs / totalMs) * 100)));

  const handle = async (fn) => {
    setLoading(true);
    try { await fn(goal._id); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 14, overflow: "hidden", background: "linear-gradient(145deg,#111113,#0d0d0f)", border: `1px solid ${hovered ? "rgba(249,115,22,0.2)" : "rgba(39,39,42,0.8)"}`, transition: "all 0.22s", transform: hovered ? "translateY(-1px)" : "translateY(0)", boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.3)" : "none" }}>
      <div style={{ height: 2, background: goal.status === "completed" ? "linear-gradient(90deg,#22c55e,transparent)" : "linear-gradient(90deg,#f97316,#ef4444,transparent)" }} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: "#f4f4f5", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{goal.title}</h3>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {isJoined && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", color: "#22c55e" }}>✓ Joined</span>}
              {isCompleted && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 20, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.22)", color: "#f97316" }}>Done</span>}
              <span style={{ fontSize: 9, color: "#3f3f46", padding: "2px 7px" }}>👥 {goal.members?.length || 0} members</span>
            </div>
          </div>

          {/* Join/Leave */}
          {!isCreator && (
            <button onClick={() => handle(isJoined ? onLeave : onJoin)} disabled={loading}
              style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.5 : 1, transition: "all 0.15s", background: isJoined ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.1)", color: isJoined ? "#f87171" : "#22c55e" }}>
              {loading ? "…" : isJoined ? "Leave" : "Join"}
            </button>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#52525b" }}>{fmt(goal.startDate)} → {fmt(goal.endDate)}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: daysLeft < 0 ? "#f87171" : daysLeft <= 7 ? "#fb923c" : "#52525b" }}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Today" : `${daysLeft}d left`}
            </span>
          </div>
          <div style={{ height: 3, borderRadius: 3, background: "rgba(39,39,42,0.8)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: "linear-gradient(90deg,#f97316,#ef4444)", transition: "width 0.8s" }} />
          </div>
        </div>

        {/* Completions */}
        {goal.completedBy?.length > 0 && (
          <p style={{ fontSize: 10, color: "#22c55e", margin: 0 }}>✓ {goal.completedBy.length} completed</p>
        )}
      </div>
    </div>
  );
}

export default function CircleGoalSection({ goals, userId, onJoin, onLeave, onCreateGoal }) {
  const active    = goals.filter(g => g.status !== "completed");
  const completed = goals.filter(g => g.status === "completed");

  const SectionHead = ({ label, count }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 1, height: 12, background: "rgba(249,115,22,0.6)" }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#3f3f46" }}>{label}</span>
        <span style={{ fontSize: 9, color: "#3f3f46", background: "rgba(39,39,42,0.5)", borderRadius: 10, padding: "1px 6px" }}>{count}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: "rgba(39,39,42,0.7)" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#f4f4f5", margin: "0 0 4px" }}>Circle Goals</h2>
          <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>Join goals to track together</p>
        </div>
        <button onClick={onCreateGoal}
          style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          + New Goal
        </button>
      </div>

      {goals.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", borderRadius: 14, border: "1px dashed rgba(39,39,42,0.7)" }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🎯</p>
          <p style={{ fontSize: 13, color: "#52525b", marginBottom: 12 }}>No goals yet. Create the first one!</p>
          <button onClick={onCreateGoal} style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Create Goal</button>
        </div>
      )}

      {active.length > 0 && (
        <div>
          <SectionHead label="Active" count={active.length} />
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr" }}>
            {active.map(g => <GoalCard key={g._id} goal={g} userId={userId} onJoin={onJoin} onLeave={onLeave} />)}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <SectionHead label="Completed" count={completed.length} />
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr" }}>
            {completed.map(g => <GoalCard key={g._id} goal={g} userId={userId} onJoin={onJoin} onLeave={onLeave} />)}
          </div>
        </div>
      )}
    </div>
  );
}