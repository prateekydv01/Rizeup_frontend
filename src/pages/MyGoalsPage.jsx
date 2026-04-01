import { useState, useEffect } from "react";
import { getMyGoals } from "../api/goal.js";
import GoalCard from "../component/Goal/GoalCard.jsx";
import CreateGoalModal from "../component/Goal/CreateGoalModal.jsx";

export default function MyGoalsPage() {
  const [goals,      setGoals]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter,     setFilter]     = useState("all");

  useEffect(() => {
    getMyGoals()
      .then(r => setGoals(r.data.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete  = (id)      => setGoals(p => p.filter(g => g._id !== id));
  const handleUpdate  = (updated) => setGoals(p => p.map(g => g._id === updated._id ? updated : g));
  const handleCreated = (goal)    => setGoals(p => [goal, ...p]);

  const counts = {
    all:       goals.length,
    active:    goals.filter(g => g.status === "active").length,
    completed: goals.filter(g => g.status === "completed").length,
    backlog:   goals.filter(g => g.status === "backlog").length,
  };

  const filtered = filter === "all" ? goals : goals.filter(g => g.status === filter);

  return (
    <div className="min-h-screen text-zinc-200 px-5 sm:px-10 md:px-16 lg:px-20 pt-8 pb-16"
      style={{ fontFamily: "'DM Sans',sans-serif", background: "var(--bg-base)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .g-card { animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .g-grid  { display:grid; gap:14px; grid-template-columns:1fr; }
        @media(min-width:640px) { .g-grid { grid-template-columns:repeat(auto-fill,minmax(min(420px,100%),1fr)); } }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:4px; }
      `}</style>

      <div className="fixed top-0 left-[20%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle,rgba(249,115,22,0.04) 0%,transparent 70%)" }} />

      <div className="relative z-10">

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f97316" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#f97316" }}>Rize Up</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,5vw,1.75rem)", background: "linear-gradient(110deg,#ffffff 0%,#fb923c 45%,#ef4444 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.02em", marginBottom: 4 }}>My Goals</h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {loading ? "Loading…" : `${counts.active} active · ${counts.completed} completed · ${counts.backlog} backlog`}
              </p>
            </div>
            <button onClick={() => setShowCreate(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              + New Goal
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        {!loading && goals.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {[["all","All"],["active","Active"],["completed","Completed"],["backlog","Backlog"]].map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", background: filter === key ? "rgba(249,115,22,0.12)" : "rgba(39,39,42,0.5)", border: filter === key ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(63,63,70,0.4)", color: filter === key ? "#f97316" : "var(--text-faint)" }}>
                {label} <span style={{ opacity: 0.6, fontSize: 10 }}>{counts[key]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
            <div style={{ width: 20, height: 20, border: "2px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && goals.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px dashed rgba(63,63,70,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎯</div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-ghost)", fontFamily: "'Syne',sans-serif" }}>No goals yet</p>
            <p style={{ fontSize: 11, color: "var(--text-ghost)" }}>Set a goal and track your progress</p>
            <button onClick={() => setShowCreate(true)}
              style={{ marginTop: 4, padding: "9px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Create Goal
            </button>
          </div>
        )}

        {/* No filter results */}
        {!loading && goals.length > 0 && filtered.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--text-ghost)", textAlign: "center", paddingTop: 40 }}>No {filter} goals.</p>
        )}

        {/* Goal grid */}
        {!loading && filtered.length > 0 && (
          <div className="g-grid">
            {filtered.map((g, i) => (
              <div key={g._id} className="g-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <GoalCard goal={g} onDelete={handleDelete} onUpdate={handleUpdate} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  );
}