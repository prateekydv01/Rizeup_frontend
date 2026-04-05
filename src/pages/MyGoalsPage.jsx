import { useState, useEffect } from "react";
import { getMyGoals } from "../api/goal.js";
import GoalCard from "../component/Goal/GoalCard.jsx";
import CreateGoalModal from "../component/Goal/CreateGoalModal.jsx";

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 1, height: 12, background: "rgba(249,115,22,0.6)" }} />
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-faint)" }}>{label}</span>
    </div>
    <div style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
  </div>
);

function EmptySlot({ label, onAction }) {
  return (
    <div style={{ padding: "24px", borderRadius: 14, border: "1px dashed rgba(39,39,42,0.7)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 12, color: "var(--text-ghost)", margin: 0 }}>No {label} goals</p>
      {onAction && (
        <button onClick={onAction} style={{ fontSize: 11, color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
          + Create one
        </button>
      )}
    </div>
  );
}

function GoalSection({ title, goals, onDelete, onUpdate, emptyAction }) {
  const personal = goals.filter(g => g.type === "personal");
  const circle   = goals.filter(g => g.type === "circle");
  const isEmpty  = goals.length === 0;

  return (
    <section>
      <Divider label={title} />
      {isEmpty ? (
        <EmptySlot label={title.toLowerCase()} onAction={title === "Active" ? emptyAction : null} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {personal.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>👤</span> Personal
              </p>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }} className="goal-grid">
                {personal.map((g, i) => (
                  <GoalCard key={g._id} goal={g} index={i} onDelete={onDelete} onUpdate={onUpdate} />
                ))}
              </div>
            </div>
          )}
          {circle.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-ghost)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>⭕</span> Circle
              </p>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }} className="goal-grid">
                {circle.map((g, i) => (
                  <GoalCard key={g._id} goal={g} index={i} onDelete={onDelete} onUpdate={onUpdate} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function MyGoalsPage() {
  const [goals,      setGoals]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    getMyGoals()
      .then(r => setGoals(r.data.data))
      .catch(() => setError("Failed to load goals"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete  = (id)      => setGoals(p => p.filter(g => g._id !== id));
  const handleUpdate  = (updated) => setGoals(p => p.map(g => g._id === updated._id ? updated : g));
  const handleCreated = (goal)    => setGoals(p => [{ ...goal, isOwner: true }, ...p]);

  const active    = goals.filter(g => g.status === "active");
  const backlog   = goals.filter(g => g.status === "backlog");
  const completed = goals.filter(g => g.status === "completed");

  return (
    <div className="min-h-screen text-zinc-200 px-5 sm:px-10 md:px-16 lg:px-20 pt-8 pb-16"
      style={{ fontFamily: "'DM Sans',sans-serif", background: "var(--bg-base)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        .goal-grid > * { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .goal-grid > *:nth-child(1) { animation-delay:0.04s; }
        .goal-grid > *:nth-child(2) { animation-delay:0.08s; }
        .goal-grid > *:nth-child(3) { animation-delay:0.12s; }
        .goal-grid > *:nth-child(4) { animation-delay:0.16s; }
        @media(min-width:860px) { .goal-grid { grid-template-columns:repeat(2,1fr) !important; } }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:4px; }
      `}</style>

      {/* Glow */}
      <div className="fixed top-0 left-[20%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle,rgba(249,115,22,0.04) 0%,transparent 70%)" }} />

      <div className="relative z-10">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f97316" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#f97316" }}>Rize Up</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,5vw,1.75rem)", background: "linear-gradient(110deg,#ffffff 0%,#fb923c 45%,#ef4444 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.02em", marginBottom: 4 }}>
                My Goals
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {loading ? "Loading…" : `${active.length} active · ${completed.length} completed · ${backlog.length} backlog`}
              </p>
            </div>
          </div>
        </div>

        {/* Create Goal CTA */}
        <div
          onClick={() => setShowCreate(true)}
          style={{ marginBottom: 32, padding: "20px 22px", borderRadius: 16, border: "1px dashed rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.03)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "all 0.2s", position: "relative", overflow: "hidden" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.06)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.03)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}>
          <div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#f4f4f5", margin: "0 0 4px" }}>Start a new goal</p>
            <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>Set a target, attach resources, and track your progress</p>
          </div>
          <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#dc2626)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20, fontWeight: 300 }}>+</div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 13 }}>{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
            <div style={{ width: 22, height: 22, border: "2px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}

        {/* Empty state (no goals at all) */}
        {!loading && goals.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", border: "1px dashed rgba(63,63,70,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎯</div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "var(--text-ghost)", letterSpacing: "0.05em" }}>No goals yet</p>
            <p style={{ fontSize: 12, color: "var(--text-ghost)", textAlign: "center", maxWidth: 260 }}>Set your first goal and start tracking your progress</p>
            <button onClick={() => setShowCreate(true)}
              style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Create First Goal
            </button>
          </div>
        )}

        {/* Three sections */}
        {!loading && goals.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <GoalSection title="Active"    goals={active}    onDelete={handleDelete} onUpdate={handleUpdate} emptyAction={() => setShowCreate(true)} />
            <GoalSection title="Backlog"   goals={backlog}   onDelete={handleDelete} onUpdate={handleUpdate} />
            <GoalSection title="Completed" goals={completed} onDelete={handleDelete} onUpdate={handleUpdate} />
          </div>
        )}

      </div>

      {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  );
}