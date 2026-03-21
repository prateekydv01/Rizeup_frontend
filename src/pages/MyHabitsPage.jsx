import { useState, useEffect } from "react";
import { getMyHabits, deleteHabit, leaveHabit, checkInHabit } from "../api/habit.js";
import { fetchTodayHabitStatuses } from "../api/checkIn.js";
import { useSelector } from "react-redux";
import HabitCard from "../component/Habit/HabitCard.jsx";
import CreateHabitModal from "../component/Habit/CreateHabitModal.jsx";

export default function MyHabitsPage() {
  const userData                    = useSelector(s => s.auth.userData);
  const [habits,       setHabits]   = useState([]);
  const [checkedInMap, setCheckedInMap] = useState({});
  const [loading,      setLoading]  = useState(true);
  const [showCreate,   setShowCreate] = useState(false);

  const fetchAll = async () => {
    try {
      const [habitsRes, statusRes] = await Promise.all([
        getMyHabits(),
        fetchTodayHabitStatuses(),
      ]);
      setHabits(habitsRes.data.data);
      setCheckedInMap(statusRes.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // Returns result so HabitCard can update graph in real-time
  const handleCheckIn = async (habitId) => {
    try {
      const res = await checkInHabit(habitId);
      const { checkedIn, streak } = res.data.data;
      setCheckedInMap(prev => ({ ...prev, [habitId]: checkedIn }));
      return { checkedIn, streak };
    } catch (e) { console.log(e); }
  };

  const handleDelete = async (habitId) => {
    try {
      await deleteHabit(habitId);
      setHabits(prev => prev.filter(h => h._id !== habitId));
    } catch (e) { console.log(e); }
  };

  const handleLeave = async (habitId) => {
    try {
      await leaveHabit(habitId);
      setHabits(prev => prev.filter(h => h._id !== habitId));
    } catch (e) { console.log(e); }
  };

  // Called by HabitCard when habit is edited, linked, or unlinked
  const handleHabitUpdate = (updatedHabit) => {
    setHabits(prev => prev.map(h => h._id === updatedHabit._id ? updatedHabit : h));
  };

  const personalHabits = habits.filter(h => h.type === "personal");
  const circleHabits   = habits.filter(h => h.type === "circle");
  const doneToday      = habits.filter(h => checkedInMap[h._id]).length;

  const Divider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 1, height: 12, background: "rgba(249,115,22,0.6)" }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-faint)" }}>{label}</span>
      </div>
      <div style={{ flex: 1, height: 1, background: "var(--border-default)" }} />
    </div>
  );

  return (
    <div className="min-h-screen text-zinc-200 px-5 sm:px-10 md:px-16 lg:px-20 pt-8 pb-16"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg-base)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }
        .habits-header { flex-wrap: wrap; }
        .habits-header h1 { font-size: clamp(1.4rem, 5vw, 1.75rem); }
        .habit-grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .habit-grid { grid-template-columns: repeat(auto-fill, minmax(min(420px,100%), 1fr)); } }
      `}</style>

      <div className="fixed top-0 left-[20%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />

      <div className="relative z-10">

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f97316" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#f97316" }}>Rize Up</span>
          </div>
          <div className="habits-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h1 style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.75rem",
                background: "linear-gradient(110deg,#ffffff 0%,#fb923c 45%,#ef4444 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                letterSpacing: "-0.02em", marginBottom: 4,
              }}>My Habits</h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {loading ? "Loading…" : `${doneToday} of ${habits.length} checked in today`}
              </p>
            </div>
            <button onClick={() => setShowCreate(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white",
                fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Habit
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
            <div style={{ width: 20, height: 20, border: "2px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && habits.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px dashed rgba(63,63,70,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-ghost)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-ghost)", fontFamily: "'Syne',sans-serif" }}>No habits yet</p>
            <p style={{ fontSize: 11, color: "var(--text-ghost)" }}>Create your first habit to start tracking</p>
            <button onClick={() => setShowCreate(true)}
              style={{ marginTop: 4, padding: "9px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Create Habit
            </button>
          </div>
        )}

        {/* Personal habits */}
        {!loading && personalHabits.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <Divider label="Personal" />
            <div className="habit-grid">
              {personalHabits.map(h => (
                <HabitCard key={h._id} habit={h}
                  checkedIn={!!checkedInMap[h._id]}
                  onCheckIn={handleCheckIn}
                  onDelete={handleDelete}
                  onLeave={handleLeave}
                  onHabitUpdate={handleHabitUpdate}
                  isCreator={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Circle habits */}
        {!loading && circleHabits.length > 0 && (
          <div>
            <Divider label="Circle Habits" />
            <div className="habit-grid">
              {circleHabits.map(h => (
                <HabitCard key={h._id} habit={h}
                  checkedIn={!!checkedInMap[h._id]}
                  onCheckIn={handleCheckIn}
                  onDelete={handleDelete}
                  onLeave={handleLeave}
                  onHabitUpdate={handleHabitUpdate}
                  isCreator={h.createdBy?._id === userData?._id || h.createdBy === userData?._id}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {showCreate && (
        <CreateHabitModal
          onClose={() => setShowCreate(false)}
          onCreated={(newHabit) => setHabits(prev => [newHabit, ...prev])}
        />
      )}
    </div>
  );
}