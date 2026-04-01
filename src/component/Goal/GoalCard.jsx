import { useState } from "react";
import { deleteGoal } from "../../api/goal.js";
import GoalDetailModal from "./GoalDetailModal.jsx";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const statusMeta = {
  active:    { color: "#f97316", bg: "rgba(249,115,22,0.1)",    border: "rgba(249,115,22,0.3)",    label: "Active"    },
  completed: { color: "#22c55e", bg: "rgba(34,197,94,0.1)",     border: "rgba(34,197,94,0.3)",     label: "Completed" },
  backlog:   { color: "#71717a", bg: "rgba(113,113,122,0.12)",  border: "rgba(113,113,122,0.3)",   label: "Backlog"   },
};

export default function GoalCard({ goal: initialGoal, onDelete, onUpdate }) {
  const [goal,       setGoal]       = useState(initialGoal);
  const [showDetail, setShowDetail] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [hovered,    setHovered]    = useState(false);

  const sm       = statusMeta[goal.status] || statusMeta.active;
  const daysLeft = goal.daysLeft ?? Math.ceil((new Date(goal.endDate) - new Date()) / 86400000);
  const isOverdue = daysLeft < 0 && goal.status === "active";

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this goal?")) return;
    setDeleting(true);
    try { await deleteGoal(goal._id); onDelete(goal._id); }
    catch (e) { console.log(e); setDeleting(false); }
  };

  const handleUpdate = (updated) => {
    setGoal(updated);
    if (onUpdate) onUpdate(updated);
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 14, overflow: "hidden", cursor: "pointer",
          background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))",
          border: `1px solid ${hovered ? "rgba(63,63,70,0.9)" : "rgba(39,39,42,0.9)"}`,
          transition: "all 0.2s",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.3)" : "none",
        }}>

        {/* Accent line */}
        <div style={{ height: 2, background: goal.status === "completed" ? "linear-gradient(90deg,#22c55e,#16a34a)" : goal.status === "backlog" ? "linear-gradient(90deg,#52525b,transparent)" : "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

        <div style={{ padding: "16px 18px" }}>
          {/* Title + badges */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 14, color: "var(--text-primary)", margin: 0 }}>
                  {goal.title}
                </h3>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: sm.bg, border: `1px solid ${sm.border}`, color: sm.color }}>
                  {sm.label}
                </span>
                {goal.type === "circle" && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316" }}>
                    ⭕ {goal.circleId?.name || "Circle"}
                  </span>
                )}
                {goal.isPending && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", color: "#eab308" }}>
                    ⏳ Pending Verification
                  </span>
                )}
              </div>
            </div>
            <button onClick={handleDelete} disabled={deleting}
              style={{ flexShrink: 0, background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", padding: 4, borderRadius: 6, opacity: deleting ? 0.4 : 1, transition: "all 0.15s", fontSize: 14 }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-ghost)"; e.currentTarget.style.background = "none"; }}>
              🗑
            </button>
          </div>

          {/* Date + days left */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", paddingTop: 10, borderTop: "1px solid rgba(39,39,42,0.6)" }}>
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>📅 {fmt(goal.startDate)} → {fmt(goal.endDate)}</span>

            {goal.status === "active" && (
              <span style={{ fontSize: 11, fontWeight: 600, color: isOverdue ? "#f87171" : daysLeft <= 7 ? "#fb923c" : "var(--text-faint)" }}>
                {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
              </span>
            )}

            {goal.resources?.length > 0 && (
              <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: "auto" }}>
                🔗 {goal.resources.length} resource{goal.resources.length > 1 ? "s" : ""}
              </span>
            )}

            {goal.isCompleted && (
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginLeft: "auto" }}>✓ You completed this</span>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <GoalDetailModal goal={goal} onClose={() => setShowDetail(false)} onUpdate={handleUpdate} />
      )}
    </>
  );
}