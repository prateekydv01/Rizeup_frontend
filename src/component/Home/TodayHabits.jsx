import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyHabits, checkInHabit } from "../../api/habit";
import { fetchTodayHabitStatuses } from "../../api/checkIn";

export default function TodayHabits() {
  const navigate = useNavigate();
  const [habits,       setHabits]       = useState([]);
  const [checkedInMap, setCheckedInMap] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [checking,     setChecking]     = useState({});

  useEffect(() => {
    Promise.all([getMyHabits(), fetchTodayHabitStatuses()])
      .then(([habitsRes, statusRes]) => {
        setHabits(habitsRes.data.data.filter(h => h.isActive));
        setCheckedInMap(statusRes.data.data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const handleCheckIn = async (habitId) => {
    if (checking[habitId]) return;
    setChecking(prev => ({ ...prev, [habitId]: true }));
    try {
      const res = await checkInHabit(habitId);
      const { checkedIn, streak } = res.data.data;
      setCheckedInMap(prev => ({ ...prev, [habitId]: checkedIn }));
      if (streak !== undefined) {
        setHabits(prev => prev.map(h => h._id === habitId ? { ...h, streak } : h));
      }
    } catch (e) { console.log(e); }
    finally { setChecking(prev => ({ ...prev, [habitId]: false })); }
  };

  const done  = habits.filter(h => checkedInMap[h._id]).length;
  const total = habits.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  if (!loading && habits.length === 0) return null;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Today's Habits
          </h2>
          {!loading && total > 0 && (
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: "var(--border-default)", color: "var(--text-muted)", border: "1px solid rgba(63,63,70,0.5)" }}>
              {done}/{total}
            </span>
          )}
        </div>
        <button onClick={() => navigate("/habits")}
          className="text-[10px] font-semibold transition-colors duration-150"
          style={{ color: "#f97316" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
          onMouseLeave={e => e.currentTarget.style.color = "#f97316"}>
          All habits →
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}>

        {/* Top accent */}
        <div className="h-[1.5px]"
          style={{ background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

        {/* Progress bar */}
        {total > 0 && (
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--border-default)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#f97316,#ef4444)",
                  }} />
              </div>
              <span className="text-[10px] font-bold tabular-nums shrink-0"
                style={{ color: pct === 100 ? "#22c55e" : "var(--text-faint)" }}>
                {pct}%
              </span>
            </div>
          </div>
        )}

        <div className="p-4 flex flex-col gap-1.5">
          {/* Loading */}
          {loading && (
            <p className="text-xs py-4 text-center" style={{ color: "var(--text-ghost)" }}>Loading…</p>
          )}

          {/* Habit rows */}
          {habits.map(habit => {
            const isChecked = !!checkedInMap[habit._id];
            const isChecking = !!checking[habit._id];
            return (
              <div key={habit._id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={{ border: "1px solid transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                {/* Check button */}
                <button
                  onClick={() => handleCheckIn(habit._id)}
                  disabled={isChecking}
                  className="flex-shrink-0 transition-all duration-200"
                  style={{
                    width: 20, height: 20, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isChecked ? "linear-gradient(135deg,#22c55e,#16a34a)" : "transparent",
                    border: isChecked ? "1px solid transparent" : "1px solid rgba(63,63,70,0.7)",
                    cursor: isChecking ? "not-allowed" : "pointer",
                    transform: isChecking ? "scale(0.85)" : "scale(1)",
                  }}>
                  {isChecking
                    ? <div style={{ width: 8, height: 8, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    : isChecked
                    ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    : null
                  }
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate transition-all duration-200"
                    style={{
                      color: isChecked ? "var(--text-ghost)" : "var(--text-primary)",
                      textDecoration: isChecked ? "line-through" : "none",
                    }}>
                    {habit.title}
                  </p>
                  {habit.description && (
                    <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-ghost)" }}>
                      {habit.description}
                    </p>
                  )}
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                  </svg>
                  <span className="text-[10px] font-bold" style={{ color: "#f97316" }}>{habit.streak || 0}</span>
                </div>

                {/* Circle badge */}
                {habit.type === "circle" && (
                  <span className="text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                    {habit.circleId?.name || "Circle"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}