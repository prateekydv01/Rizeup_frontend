import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/auth.slice.js";
import { logoutUser } from "../api/auth.js";

import LandingPage   from "../component/Home/LandingPage.jsx";
import DailyProgress from "../component/Home/DailyProgress.jsx";
import StreakCard     from "../component/Home/StreakCard.jsx";
import StatsCard     from "../component/Home/StatsCard.jsx";
import TodayTodos    from "../component/Home/TodayTodos.jsx";
import TodayHabits   from "../component/Home/TodayHabits.jsx";
import CircleGoals   from "../component/Home/CircleGoals.jsx";
import ActiveGoals   from "../component/Home/ActiveGoals.jsx";

export default function HomePage() {
  const userData  = useSelector(state => state.auth.userData);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [todaySectionId, setTodaySectionId] = useState(null);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate("/login");
  };

  if (!userData) return <LandingPage />;

  const firstName = (userData.fullName || userData.name || "User").split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const Divider = ({ label }) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <div className="w-px h-3" style={{ background: "rgba(249,115,22,0.6)" }} />
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--text-faint)" }}>{label}</span>
      </div>
      <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }
      `}</style>

      <div className="min-h-screen text-white pt-14 md:pt-0"
        style={{ background: "var(--bg-base)", fontFamily: "'DM Sans', sans-serif" }}>

        <div className="fixed top-0 left-[30%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 px-5 sm:px-10 md:px-14 lg:px-20 pt-8 pb-16 flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-1 rounded-full" style={{ background: "#f97316" }} />
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "#f97316" }}>Rize Up</span>
              </div>
              <h1 className="font-black tracking-tight"
                style={{
                  fontFamily: "'Syne', sans-serif", fontSize: "1.75rem",
                  background: "linear-gradient(110deg,#ffffff 0%,#fb923c 45%,#ef4444 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                Welcome, {firstName} 
              </h1>
              <p className="text-zinc-500 text-xs tracking-wide mt-0.5">{today}</p>
            </div>

            <button onClick={handleLogout}
              className="flex-shrink-0 mt-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: "var(--border-subtle)", border: "1px solid rgba(63,63,70,0.6)", color: "var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.1)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}>
              Logout
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DailyProgress todaySectionId={todaySectionId} />
            <StreakCard />
            <StatsCard />
          </div>

          <Divider label="Today" />
          <TodayTodos onSectionResolved={setTodaySectionId} />

          <Divider label="Habits" />
          <TodayHabits />

          <Divider label="Goals" />
          <ActiveGoals />

          <Divider label="Circles" />
          <CircleGoals />

        </div>
      </div>
    </>
  );
}