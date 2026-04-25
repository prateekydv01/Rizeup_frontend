import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyGoals } from "../../api/goal.js";

export default function ActiveGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyGoals()
      .then(r => {
        const active = r.data.data.filter(g => g.status === "active");
        setGoals(active);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Active Goals
          </h2>
          {goals.length > 0 && (
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: "var(--border-default)", color: "var(--text-muted)", border: "1px solid rgba(63,63,70,0.5)" }}>
              {goals.length}
            </span>
          )}
        </div>
        <button onClick={() => navigate("/goals")}
          className="text-[10px] font-semibold transition-colors duration-150"
          style={{ color: "#f97316" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
          onMouseLeave={e => e.currentTarget.style.color = "#f97316"}>
          All goals →
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}>

        <div className="h-[1.5px]"
          style={{ background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

        {goals.length === 0 ? (
          <div className="p-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(249,115,22,0.08)", border: "1px dashed rgba(249,115,22,0.25)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-muted)" }}>No active goals</p>
              <p className="text-[11px]" style={{ color: "var(--text-ghost)" }}>Set a target and start tracking your progress</p>
            </div>
            <button
              onClick={() => navigate("/goals")}
              className="px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg,#f97316,#dc2626)" }}>
              + Create a Goal
            </button>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-1.5">
            {goals.map(goal => {
              const totalMs  = new Date(goal.endDate) - new Date(goal.startDate);
              const passedMs = new Date() - new Date(goal.startDate);
              const pct      = Math.min(100, Math.max(0, Math.round((passedMs / totalMs) * 100)));
              const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / 86400000);
              const overdue  = daysLeft < 0;

              return (
                <div key={goal._id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                  <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: "var(--text-primary)" }}>{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--border-default)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: overdue ? "linear-gradient(90deg,#ef4444,#dc2626)" : "linear-gradient(90deg,#f97316,#ef4444)",
                          }} />
                      </div>
                      <span className="text-[9px] font-bold tabular-nums flex-shrink-0"
                        style={{ color: overdue ? "#f87171" : "var(--text-ghost)" }}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <span className="text-[9px] font-bold"
                      style={{ color: overdue ? "#f87171" : daysLeft <= 7 ? "#fb923c" : "var(--text-ghost)" }}>
                      {overdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                    </span>
                    {goal.type === "circle" && (
                      <p className="text-[8px] mt-0.5" style={{ color: "var(--text-ghost)" }}>
                        ⭕ {goal.circleId?.name || "Circle"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}