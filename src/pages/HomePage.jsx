import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/auth.slice.js";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.js";

// ─── Icons ───────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const PlannerIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="14" y2="18" />
  </svg>
);
const CirclesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="13" cy="16" r="3" /><line x1="9" y1="10" x2="13" y2="13" /><line x1="17" y1="10" x2="13" y2="13" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const BellIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ─── Nav items ───────────────────────────────────────────
const navItems = [
  { label: "Home",          icon: <HomeIcon /> },
  { label: "My Planner",   icon: <PlannerIcon /> },
  { label: "Circles",      icon: <CirclesIcon /> },
  { label: "Analytics",    icon: <AnalyticsIcon /> },
  { label: "Notifications",icon: <BellIcon />, badge: 3 },
];

// ─── GitHub-style contribution graph ─────────────────────
function ContributionGraph({ data }) {
  const weeks = [];
  for (let w = 0; w < 15; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      days.push(data[idx] ?? 0);
    }
    weeks.push(days);
  }
  const colorMap = ["bg-zinc-800", "bg-orange-900/70", "bg-orange-600/70", "bg-orange-500", "bg-orange-400"];
  return (
    <div className="flex gap-[3px]">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((val, di) => (
            <div
              key={di}
              title={`${val} contributions`}
              className={`w-[10px] h-[10px] rounded-[2px] ${colorMap[Math.min(val, 4)]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Circular progress ───────────────────────────────────
function CircleProgress({ pct }) {
  const r = 28, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#27272a" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="url(#fireGrad)" strokeWidth="5"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <text x="36" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{pct}%</text>
    </svg>
  );
}

// ─── Sidebar NavItem ──────────────────────────────────────
function NavItem({ item, active, onClick }) {
  const isActive = active === item.label;
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group cursor-pointer border text-left
        ${isActive ? "bg-orange-500/15 border-orange-500/30 text-orange-300" : "border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/5"}`}>
      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-r-full" />}
      <span className={`flex-shrink-0 transition-all duration-200 ${isActive ? "text-orange-400" : "group-hover:text-zinc-300"}`}>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-[10px] font-bold bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{item.badge}</span>
      )}
    </button>
  );
}

// ─── Logo ─────────────────────────────────────────────────
function Logo({ size = "md" }) {
  const box  = size === "sm" ? "w-8 h-8 text-sm rounded-lg"  : "w-9 h-9 text-base rounded-xl";
  const text = size === "sm" ? "text-lg" : "text-xl";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-white flex-shrink-0`}
        style={{ fontFamily: "'Syne', sans-serif" }}>R</div>
      <span className={`${text} font-black text-white tracking-tight`} style={{ fontFamily: "'Syne', sans-serif" }}>
        Rize<span className="text-orange-400">Up</span>
      </span>
    </div>
  );
}

// ─── Mock data ────────────────────────────────────────────

const todayTodos = [
  { id: 1, text: "Solve 2 LeetCode problems",    done: true  },
  { id: 2, text: "Read 20 pages of Atomic Habits",done: false },
  { id: 3, text: "30 min evening run",            done: false },
  { id: 4, text: "Review pull request #42",       done: true  },
];

const graphData = Array.from({ length: 105 }, (_, i) =>
  Math.random() < 0.55 ? Math.floor(Math.random() * 4) + 1 : 0
);

const habits = [
  { name: "Daily DSA",    streak: 21, graph: Array.from({ length: 105 }, () => Math.random() < 0.7 ? Math.floor(Math.random()*4)+1 : 0), checked: true  },
  { name: "GitHub Push",  streak: 14, graph: Array.from({ length: 105 }, () => Math.random() < 0.6 ? Math.floor(Math.random()*4)+1 : 0), checked: false },
  { name: "Morning Pages",streak: 9,  graph: Array.from({ length: 105 }, () => Math.random() < 0.5 ? Math.floor(Math.random()*4)+1 : 0), checked: false },
];

const goals = [
  { name: "Land a SWE Internship", progress: 65, deadline: "Mar 30" },
  { name: "Complete DSA Sheet",    progress: 42, deadline: "Apr 15" },
];

const circles = [
  { name: "DSA Practice Squad",  members: 6, task: "Solve Graph problems", done: false },
  { name: "Morning Run Club",    members: 4, task: "Log 5K run",            done: true  },
  { name: "System Design Study", members: 8, task: "Present HLD design",   done: false },
  { name: "Open Source Contrib", members: 5, task: "Submit a PR today",    done: false },
];

// ─── Main Component ───────────────────────────────────────
export default function HomePage() {
  const userData   = useSelector((state) => state.auth.userData);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const [active,     setActive]     = useState("Home");
  const [menuOpen,   setMenuOpen]   = useState(false);
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

  // ── Auth guard ──────────────────────────────────────────
  if (!userData) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@400;500&display=swap');`}</style>
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 px-4"
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-[0_0_24px_rgba(249,115,22,0.4)]"
            style={{ fontFamily: "'Syne', sans-serif" }}>R</div>
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              You're not logged in
            </h1>
            <p className="text-zinc-500 text-sm">Please sign in to access your RizeUp dashboard.</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            Go to Login
          </button>
        </div>
      </>
    );
  }

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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>

      <div className="flex min-h-screen bg-zinc-950 text-white">

        {/* ══════════════════════════════
            DESKTOP SIDEBAR
        ══════════════════════════════ */}
        <aside className="hidden md:flex flex-col w-56 min-h-screen bg-zinc-900 border-r border-white/[0.06] px-3 py-6 flex-shrink-0 fixed top-0 left-0 h-full z-30">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          <div className="px-2 pb-6 mb-4 border-b border-white/[0.06]"><Logo /></div>
          <nav className="flex flex-col gap-1 flex-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600 px-3 mb-2">Menu</p>
            {navItems.map(item => <NavItem key={item.label} item={item} active={active} onClick={() => setActive(item.label)} />)}
          </nav>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-3">
              <span className="text-2xl leading-none">🔥</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne', sans-serif" }}>21 Days</span>
                <span className="text-zinc-500 text-[11px]">Current streak</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════
            MOBILE TOPBAR
        ══════════════════════════════ */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-900 border-b border-white/[0.06] flex items-center justify-between px-4">
          <Logo size="sm" />
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-white/5 transition-colors">
            <span className={`block w-5 h-0.5 bg-zinc-400 rounded transition-all duration-300 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-zinc-400 rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-zinc-400 rounded transition-all duration-300 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile backdrop */}
        <div onClick={() => setMenuOpen(false)}
          className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

        {/* Mobile drawer */}
        <div className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-zinc-900 border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
            <Logo size="sm" />
            <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 flex items-center justify-center text-sm transition-all">✕</button>
          </div>
          <nav className="flex flex-col gap-1 flex-1 px-3 py-5 overflow-y-auto">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600 px-3 mb-2">Menu</p>
            {navItems.map(item => <NavItem key={item.label} item={item} active={active} onClick={() => { setActive(item.label); setMenuOpen(false); }} />)}
          </nav>
          <div className="px-3 pb-6 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-3">
              <span className="text-2xl leading-none">🔥</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne', sans-serif" }}>21 Days</span>
                <span className="text-zinc-500 text-[11px]">Current streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            MAIN CONTENT
        ══════════════════════════════ */}
        <main className="flex-1 md:ml-56 mt-14 md:mt-0 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col gap-8">

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-zinc-500 text-sm">{today}</p>
                <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{firstName}!</span> 👋
                </h1>
                <p className="text-zinc-500 text-sm mt-0.5">Here's your progress for today. Stay consistent.</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 mt-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-red-600/20 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-all duration-200"
              >
                Logout
              </button>
            </div>

            {/* ── 3 STAT CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Card 1 — Daily Progress */}
              <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Daily Progress</p>
                    <p className="text-zinc-400 text-xs mt-1">{doneTodos} of {todos.length} tasks done</p>
                  </div>
                  <CircleProgress pct={progressPct} />
                </div>
                <button
                  onClick={() => setCheckedIn(true)}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 border
                    ${checkedIn
                      ? "bg-orange-500/10 border-orange-500/30 text-orange-400 cursor-default"
                      : "bg-gradient-to-r from-orange-500 to-red-600 border-transparent text-white hover:opacity-90 active:scale-95"
                    }`}
                >
                  {checkedIn ? "✓ Checked In Today" : "Daily Check-In"}
                </button>
              </div>

              {/* Card 2 — Streak */}
              <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Current Streak</p>
                <div className="flex items-center gap-3 my-3">
                  <span className="text-5xl leading-none">🔥</span>
                  <div>
                    <p className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>21</p>
                    <p className="text-zinc-500 text-xs">consecutive days</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: "70%" }} />
                </div>
                <p className="text-zinc-600 text-xs mt-1.5">9 days to next milestone 🏆</p>
              </div>

              {/* Card 3 — Active Goals Summary */}
              <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Active Goals</p>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                      <FlameIcon /><span>Habits ongoing</span>
                    </div>
                    <span className="text-orange-400 font-bold text-sm">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                      <TargetIcon /><span>Goals active</span>
                    </div>
                    <span className="text-orange-400 font-bold text-sm">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                      <UsersIcon /><span>Circles joined</span>
                    </div>
                    <span className="text-orange-400 font-bold text-sm">4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── TODAY'S TODOS ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Today's To-Do</h2>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">{doneTodos}/{todos.length} done</span>
              </div>

              <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2">
                {todos.map(todo => (
                  <div key={todo.id} onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/[0.03] transition-all group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${todo.done ? "bg-gradient-to-br from-orange-500 to-red-600 border-orange-500" : "border-zinc-700 group-hover:border-zinc-500"}`}>
                      {todo.done && <CheckIcon />}
                    </div>
                    <span className={`text-sm transition-all ${todo.done ? "line-through text-zinc-600" : "text-zinc-300"}`}>{todo.text}</span>
                  </div>
                ))}

                {/* Add todo */}
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-dashed border-zinc-700 focus-within:border-orange-500/50 transition-colors">
                  <PlusIcon />
                  <input
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTodo()}
                    placeholder="Add a task... (press Enter)"
                    className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* ── MY HABITS ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Habits</h2>
                <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View all →</button>
              </div>

              <div className="flex flex-col gap-3">
                {habits.map(habit => (
                  <div key={habit.name} className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-white font-semibold text-sm">{habit.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-base">🔥</span>
                          <span className="text-orange-400 text-xs font-bold">{habit.streak} day streak</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setHabitCheck(prev => ({ ...prev, [habit.name]: !prev[habit.name] }))}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                          ${habitCheck[habit.name]
                            ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-orange-500/40 hover:text-orange-300"
                          }`}
                      >
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
                <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View all →</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map(goal => (
                  <div key={goal.name} className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <p className="text-white font-semibold text-sm leading-snug pr-2">{goal.name}</p>
                      <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full flex-shrink-0">Due {goal.deadline}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-orange-400 font-bold">{goal.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                          style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                    <button className="w-full py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.04] transition-all">
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
                <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View all →</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {circles.map(circle => (
                  <div key={circle.name} className={`bg-zinc-900 rounded-2xl p-5 flex flex-col gap-3 border transition-all duration-200
                    ${circDone[circle.name] ? "border-orange-500/25 bg-orange-500/5" : "border-white/[0.06]"}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-sm">{circle.name}</p>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <UsersIcon />
                        <span className="text-xs">{circle.members}</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-xs">Today: <span className="text-zinc-300">{circle.task}</span></p>
                    <button
                      onClick={() => setCircDone(prev => ({ ...prev, [circle.name]: !prev[circle.name] }))}
                      className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all duration-200
                        ${circDone[circle.name]
                          ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-orange-500/40 hover:text-orange-300"
                        }`}
                    >
                      {circDone[circle.name] ? "✓ Submitted Proof" : "Submit Proof"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}