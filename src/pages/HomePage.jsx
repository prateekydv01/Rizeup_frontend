import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth.slice.js";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.js";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const FlameIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const TargetIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

function ContributionGraph({ data }) {
  const weeks = [];
  for (let w = 0; w < 15; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) days.push(data[w * 7 + d] ?? 0);
    weeks.push(days);
  }
  const colorMap = ["bg-zinc-800", "bg-orange-900/70", "bg-orange-600/70", "bg-orange-500", "bg-orange-400"];
  return (
    <div className="flex gap-[3px]">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((val, di) => (
            <div key={di} title={`${val} contributions`}
              className={`w-[10px] h-[10px] rounded-[2px] ${colorMap[Math.min(val, 4)]}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CircleProgress({ pct }) {
  const r = 28, c = 2 * Math.PI * r, dash = (pct / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#27272a" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="url(#fireGrad)" strokeWidth="5"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <text x="36" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{pct}%</text>
    </svg>
  );
}

const todayTodos = [
  { id: 1, text: "Solve 2 LeetCode problems",      done: true  },
  { id: 2, text: "Read 20 pages of Atomic Habits",  done: false },
  { id: 3, text: "30 min evening run",              done: false },
  { id: 4, text: "Review pull request #42",         done: true  },
];

const habits = [
  { name: "Daily DSA",     streak: 21, graph: Array.from({ length: 105 }, () => Math.random() < 0.7 ? Math.floor(Math.random()*4)+1 : 0) },
  { name: "GitHub Push",   streak: 14, graph: Array.from({ length: 105 }, () => Math.random() < 0.6 ? Math.floor(Math.random()*4)+1 : 0) },
  { name: "Morning Pages", streak: 9,  graph: Array.from({ length: 105 }, () => Math.random() < 0.5 ? Math.floor(Math.random()*4)+1 : 0) },
];

const goals = [
  { name: "Land a SWE Internship", progress: 65, deadline: "Mar 30" },
  { name: "Complete DSA Sheet",    progress: 42, deadline: "Apr 15" },
];

const circles = [
  { name: "DSA Practice Squad",  members: 6, task: "Solve Graph problems" },
  { name: "Morning Run Club",    members: 4, task: "Log 5K run"           },
  { name: "System Design Study", members: 8, task: "Present HLD design"  },
  { name: "Open Source Contrib", members: 5, task: "Submit a PR today"   },
];

export default function HomePage() {
  const userData  = useSelector((state) => state.auth.userData);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [todos,      setTodos]      = useState(todayTodos);
  const [newTodo,    setNewTodo]    = useState("");
  const [checkedIn,  setCheckedIn]  = useState(false);
  const [habitCheck, setHabitCheck] = useState({ "Daily DSA": true, "GitHub Push": false, "Morning Pages": false });
  const [circDone,   setCircDone]   = useState({ "DSA Practice Squad": false, "Morning Run Club": true, "System Design Study": false, "Open Source Contrib": false });

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate("/login");
  };

  /* shared card helpers */
  const card = { background: "#0e0e10", border: "1px solid rgba(39,39,42,0.9)", borderRadius: "16px" };
  const cardHover = (e) => e.currentTarget.style.borderColor = "rgba(63,63,70,0.9)";
  const cardLeave = (e) => e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)";

  /* ── LOGGED-OUT LANDING ── */
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#080809", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
          .land-outline { color: #a1a1aa; border: 1px solid rgba(63,63,70,0.6); background: transparent; transition: all 0.2s; }
          .land-outline:hover { color: #fff; border-color: rgba(82,82,91,0.9); }
          .land-primary { background: linear-gradient(135deg, #f97316, #dc2626); transition: opacity 0.2s; }
          .land-primary:hover { opacity: 0.88; }
          .feat-pill { background: rgba(24,24,27,0.8); border: 1px solid rgba(39,39,42,0.9); color: #71717a; }
        `}</style>

        {/* Ambient glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />

        {/* Top nav */}
        <header className="relative z-10 flex items-center justify-between px-8 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f97316, #dc2626)", fontFamily: "'Syne', sans-serif", fontSize: "15px" }}>
              R
            </div>
            <span className="text-lg font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Rize<span style={{ color: "#f97316" }}>Up</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="land-outline px-4 py-1.5 rounded-xl text-sm font-semibold">
              Sign in
            </button>
            <button onClick={() => navigate("/signup")} className="land-primary px-4 py-1.5 rounded-xl text-sm font-bold text-white active:scale-95">
              Get started
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center gap-8 py-20">

          {/* Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f97316" }} />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "#f97316" }}>
              Your daily accountability OS
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="font-black tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
                lineHeight: 1.05,
                background: "linear-gradient(110deg, #ffffff 0%, #fb923c 50%, #ef4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              Rise every single day.
            </h1>
            <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: "#71717a" }}>
              Track habits, crush goals, and stay accountable with your circles. Build the streak that defines you.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button onClick={() => navigate("/signup")} className="land-primary px-7 py-3 rounded-xl text-sm font-bold text-white active:scale-95">
              Start for free &rarr;
            </button>
            <button onClick={() => navigate("/login")} className="land-outline px-7 py-3 rounded-xl text-sm font-semibold">
              Sign in
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {[
              { icon: <FlameIcon />, label: "Streak tracking"        },
              { icon: <CheckIcon />, label: "Daily planner"          },
              { icon: <TargetIcon />, label: "Goal progress"         },
              { icon: <UsersIcon />, label: "Accountability circles" },
            ].map(({ icon, label }) => (
              <span key={label} className="feat-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium">
                <span style={{ color: "#52525b" }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>

        </main>

        {/* Bottom accent */}
        <div className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)" }} />
      </div>
    );
  }

  /* ── LOGGED-IN DASHBOARD ── */

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const doneTodos = todos.filter(t => t.done).length;
  const progressPct = Math.round((doneTodos / todos.length) * 100);
  const firstName = (userData.fullName || userData.name || "User").split(" ")[0];

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), done: false }]);
    setNewTodo("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        .todo-row:hover { background: rgba(255,255,255,0.025) !important; }
        .view-all:hover { color: #fb923c !important; }
      `}</style>

      <div className="text-white pt-14 md:pt-0" style={{ background: "#080809", fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-12 flex flex-col gap-8">

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-zinc-500 text-sm">{today}</p>
              <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{firstName}!</span>
              </h1>
              <p className="text-zinc-500 text-sm mt-0.5">Here's your progress for today. Stay consistent.</p>
            </div>
            <button onClick={handleLogout}
              className="flex-shrink-0 mt-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{ background: "rgba(39,39,42,0.6)", border: "1px solid rgba(63,63,70,0.6)", color: "#71717a" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.1)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(39,39,42,0.6)"; e.currentTarget.style.color = "#71717a"; e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)"; }}>
              Logout
            </button>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200" style={card}
              onMouseEnter={cardHover} onMouseLeave={cardLeave}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Daily Progress</p>
                  <p className="text-zinc-400 text-xs mt-1">{doneTodos} of {todos.length} tasks done</p>
                </div>
                <CircleProgress pct={progressPct} />
              </div>
              <button onClick={() => setCheckedIn(true)}
                className="w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                style={checkedIn
                  ? { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c", cursor: "default" }
                  : { background: "linear-gradient(135deg, #f97316, #dc2626)", border: "1px solid transparent", color: "white" }}>
                {checkedIn ? "✓ Checked In Today" : "Daily Check-In"}
              </button>
            </div>

            <div className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200" style={card}
              onMouseEnter={cardHover} onMouseLeave={cardLeave}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Current Streak</p>
              <div className="flex items-center gap-3 my-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                <div>
                  <p className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>21</p>
                  <p className="text-zinc-500 text-xs">consecutive days</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#27272a" }}>
                <div className="h-full rounded-full" style={{ width: "70%", background: "linear-gradient(90deg, #f97316, #ef4444)" }} />
              </div>
              <p className="text-zinc-600 text-xs mt-1.5">9 days to next milestone</p>
            </div>

            <div className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200" style={card}
              onMouseEnter={cardHover} onMouseLeave={cardLeave}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#52525b" }}>Active Goals</p>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid rgba(39,39,42,0.6)" }}>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm"><FlameIcon /><span>Habits ongoing</span></div>
                  <span className="text-orange-400 font-bold text-sm">3</span>
                </div>
                <div className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid rgba(39,39,42,0.6)" }}>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm"><TargetIcon /><span>Goals active</span></div>
                  <span className="text-orange-400 font-bold text-sm">2</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm"><UsersIcon /><span>Circles joined</span></div>
                  <span className="text-orange-400 font-bold text-sm">4</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── TODAY'S TODOS ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Today's To-Do</h2>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: "rgba(39,39,42,0.8)", color: "#71717a", border: "1px solid rgba(63,63,70,0.5)" }}>
                {doneTodos}/{todos.length} done
              </span>
            </div>
            <div className="rounded-2xl p-4 flex flex-col gap-1.5" style={card}>
              {todos.map(todo => (
                <div key={todo.id}
                  onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))}
                  className="todo-row flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ background: "transparent" }}>
                  <div className="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={todo.done
                      ? { background: "linear-gradient(135deg, #f97316, #dc2626)", borderColor: "transparent" }
                      : { background: "transparent", borderColor: "#3f3f46" }}>
                    {todo.done && <CheckIcon />}
                  </div>
                  <span className="text-sm transition-all duration-200"
                    style={{ color: todo.done ? "#3f3f46" : "#d4d4d8", textDecoration: todo.done ? "line-through" : "none" }}>
                    {todo.text}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl transition-all duration-200"
                style={{ border: "1px solid rgba(39,39,42,0.8)", background: "rgba(24,24,27,0.5)" }}>
                <span style={{ color: "#3f3f46" }}><PlusIcon /></span>
                <input value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key === "Enter" && addTodo()}
                  placeholder="Add a task... (press Enter)"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-700"
                  style={{ color: "#d4d4d8" }}
                  onFocus={e => e.currentTarget.closest("div").style.borderColor = "rgba(249,115,22,0.4)"}
                  onBlur={e => e.currentTarget.closest("div").style.borderColor = "rgba(39,39,42,0.8)"} />
              </div>
            </div>
          </section>

          {/* ── MY HABITS ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Habits</h2>
              <button className="view-all text-xs font-semibold transition-colors duration-150" style={{ color: "#f97316" }}>View all &rarr;</button>
            </div>
            <div className="flex flex-col gap-3">
              {habits.map(habit => (
                <div key={habit.name} className="rounded-2xl p-5 transition-all duration-200" style={card}
                  onMouseEnter={cardHover} onMouseLeave={cardLeave}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-semibold text-sm">{habit.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                        </svg>
                        <span className="text-orange-400 text-xs font-bold">{habit.streak} day streak</span>
                      </div>
                    </div>
                    <button onClick={() => setHabitCheck(prev => ({ ...prev, [habit.name]: !prev[habit.name] }))}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
                      style={habitCheck[habit.name]
                        ? { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }
                        : { background: "rgba(24,24,27,0.8)", border: "1px solid rgba(39,39,42,0.9)", color: "#71717a" }}>
                      {habitCheck[habit.name] ? "✓ Done" : "Check In"}
                    </button>
                  </div>
                  <ContributionGraph data={habit.graph} />
                </div>
              ))}
            </div>
          </section>

          {/* ── MY GOALS ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Goals</h2>
              <button className="view-all text-xs font-semibold transition-colors duration-150" style={{ color: "#f97316" }}>View all &rarr;</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map(goal => (
                <div key={goal.name} className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200" style={card}
                  onMouseEnter={cardHover} onMouseLeave={cardLeave}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-semibold text-sm leading-snug">{goal.name}</p>
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "rgba(39,39,42,0.8)", color: "#52525b", border: "1px solid rgba(63,63,70,0.5)" }}>
                      Due {goal.deadline}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "#52525b" }}>Progress</span>
                      <span className="font-bold" style={{ color: "#f97316" }}>{goal.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#27272a" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%`, background: "linear-gradient(90deg, #f97316, #ef4444)" }} />
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
                    style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(39,39,42,0.9)", color: "#71717a" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.9)"; e.currentTarget.style.color = "#d4d4d8"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)"; e.currentTarget.style.color = "#71717a"; }}>
                    Update Progress
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── CIRCLE GOALS ── */}
          <section className="pb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Circle Goals</h2>
              <button className="view-all text-xs font-semibold transition-colors duration-150" style={{ color: "#f97316" }}>View all &rarr;</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {circles.map(circle => (
                <div key={circle.name} className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200"
                  style={circDone[circle.name]
                    ? { background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "16px" }
                    : { ...card }}
                  onMouseEnter={e => { if (!circDone[circle.name]) cardHover(e); }}
                  onMouseLeave={e => { if (!circDone[circle.name]) cardLeave(e); }}>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold text-sm">{circle.name}</p>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                      style={{ background: "rgba(39,39,42,0.6)", border: "1px solid rgba(63,63,70,0.4)" }}>
                      <UsersIcon />
                      <span className="text-[10px] font-bold" style={{ color: "#71717a" }}>{circle.members}</span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "#52525b" }}>
                    Today: <span style={{ color: "#a1a1aa" }}>{circle.task}</span>
                  </p>
                  <button onClick={() => setCircDone(prev => ({ ...prev, [circle.name]: !prev[circle.name] }))}
                    className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
                    style={circDone[circle.name]
                      ? { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#fb923c" }
                      : { background: "rgba(24,24,27,0.8)", border: "1px solid rgba(39,39,42,0.9)", color: "#71717a" }}>
                    {circDone[circle.name] ? "✓ Submitted Proof" : "Submit Proof"}
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}