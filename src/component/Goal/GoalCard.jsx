import { useState } from "react";
import { deleteGoal } from "../../api/goal.js";
import GoalDetailModal from "./Goaldetailmodal.jsx";
import { useSelector } from "react-redux";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const STATUS = {
  active:    { color: "#f97316", bg: "rgba(249,115,22,0.1)",   border: "rgba(249,115,22,0.25)",  dot: "#f97316" },
  completed: { color: "#22c55e", bg: "rgba(34,197,94,0.1)",    border: "rgba(34,197,94,0.25)",   dot: "#22c55e" },
  backlog:   { color: "#71717a", bg: "rgba(113,113,122,0.12)", border: "rgba(113,113,122,0.25)", dot: "#71717a" },
};

export default function GoalCard({ goal: initialGoal, onDelete, onUpdate, index = 0 }) {
  const [goal,       setGoal]       = useState(initialGoal);
  const [showDetail, setShowDetail] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [hovered,    setHovered]    = useState(false);

  const sm = STATUS[goal.status] || STATUS.active;

  const totalMs  = new Date(goal.endDate) - new Date(goal.startDate);
  const passedMs = new Date() - new Date(goal.startDate);
  const pct      = goal.status === "completed" ? 100 : Math.min(100, Math.max(0, Math.round((passedMs / totalMs) * 100)));
  const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / 86400000);
  const overdue  = daysLeft < 0 && goal.status !== "completed";

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this goal?")) return;
    setDeleting(true);
    try { await deleteGoal(goal._id); onDelete(goal._id); }
    catch { setDeleting(false); }
  };

  const getId = (u) => u?._id?.toString() || u?.toString();
  const currentUserId = useSelector( state => state.auth.userData?._id)?.toString();
  const isCreator = getId(goal.createdBy) === currentUserId;
  const isAdmin = getId(goal.circleId?.admin) === currentUserId;

  const canDelete = isCreator || isAdmin;

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 16,
          overflow: "hidden",
          cursor: "pointer",
          background: "linear-gradient(160deg,#111113 0%,#0d0d0f 100%)",
          border: `1px solid ${hovered ? "rgba(249,115,22,0.2)" : "rgba(39,39,42,0.9)"}`,
          transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.06)" : "0 2px 8px rgba(0,0,0,0.15)",
          animationDelay: `${index * 0.06}s`,
        }}>

        {/* Gradient top bar */}
        <div style={{ height: 3, background: goal.status === "completed" ? "linear-gradient(90deg,#22c55e,#16a34a,transparent)" : goal.status === "backlog" ? "linear-gradient(90deg,#52525b,#3f3f46,transparent)" : "linear-gradient(90deg,#f97316,#ef4444,transparent)" }} />

        <div style={{ padding: "20px 22px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: "#f4f4f5", margin: "0 0 8px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                {goal.title}
              </h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: sm.bg, border: `1px solid ${sm.border}`, color: sm.color }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: sm.dot }} />
                  {goal.status}
                </span>
                {goal.type === "circle" && (
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#a5b4fc" }}>
                    ⭕ {goal.circleId?.name || "Circle"}
                  </span>
                )}
                {goal.isPending && (
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.22)", color: "#fbbf24" }}>
                    ⏳ Pending
                  </span>
                )}
              </div>
            </div>

           {canDelete && (<button onClick={handleDelete} disabled={deleting}
              style={{ flexShrink: 0, background: "transparent", border: "1px solid transparent", color: "#3f3f46", cursor: "pointer", padding: "5px 7px", borderRadius: 8, opacity: deleting ? 0.4 : 1, transition: "all 0.15s", fontSize: 13 }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#3f3f46"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
              🗑
            </button>)}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#52525b", fontWeight: 500 }}>
                {goal.status === "completed" ? "Completed" : `${pct}% time elapsed`}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: overdue ? "#f87171" : daysLeft <= 7 ? "#fb923c" : goal.status === "completed" ? "#22c55e" : "#52525b" }}>
                {goal.status === "completed" ? "✓ Done" : overdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: "rgba(39,39,42,0.8)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4, width: `${pct}%`,
                background: goal.status === "completed" ? "linear-gradient(90deg,#22c55e,#16a34a)" : overdue ? "linear-gradient(90deg,#ef4444,#dc2626)" : "linear-gradient(90deg,#f97316,#ef4444)",
                transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
              }} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: 12, borderTop: "1px solid rgba(39,39,42,0.6)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{ fontSize: 11, color: "#52525b" }}>{fmt(goal.startDate)} → {fmt(goal.endDate)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {goal.resources?.length > 0 && (
                <span style={{ fontSize: 10, color: "#52525b", display: "flex", alignItems: "center", gap: 3 }}>
                  🔗 {goal.resources.length}
                </span>
              )}
              {goal.isCompleted && (
                <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>✓ You</span>
              )}
              <span style={{ fontSize: 11, color: hovered ? "#f97316" : "#3f3f46", transition: "color 0.2s, transform 0.2s", display: "inline-block", transform: hovered ? "translateX(2px)" : "translateX(0)" }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {showDetail && (
        <GoalDetailModal goal={goal} onClose={() => setShowDetail(false)} onUpdate={updated => { setGoal(updated); if (onUpdate) onUpdate(updated); }} />
      )}
    </>
  );
}