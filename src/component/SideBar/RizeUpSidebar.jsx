import { useState } from "react";

const HomeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PlannerIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="14" y2="18" />
  </svg>
);

const CirclesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <circle cx="17" cy="7" r="3" />
    <circle cx="13" cy="16" r="3" />
    <line x1="9" y1="10" x2="13" y2="13" />
    <line x1="17" y1="10" x2="13" y2="13" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const BellIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const navItems = [
  { label: "Home",          icon: <HomeIcon />,      badge: null },
  { label: "My Planner",   icon: <PlannerIcon />,   badge: null },
  { label: "Circles",      icon: <CirclesIcon />,   badge: null },
  { label: "Analytics",    icon: <AnalyticsIcon />, badge: null },
  { label: "Notifications",icon: <BellIcon />,      badge: 3   },
];

function NavItem({ item, active, onClick }) {
  const isActive = active === item.label;
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 relative group cursor-pointer border text-left
        ${isActive
          ? "bg-orange-500/15 border-orange-500/30 text-orange-300"
          : "border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
        }
      `}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-r-full" />
      )}
      <span className={`flex-shrink-0 transition-all duration-200 ${isActive ? "text-orange-400" : "group-hover:text-zinc-300"}`}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-[10px] font-bold bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {item.badge}
        </span>
      )}
    </button>
  );
}

function Logo({ size = "md" }) {
  const box  = size === "sm" ? "w-8 h-8 text-sm rounded-lg"  : "w-9 h-9 text-base rounded-xl";
  const text = size === "sm" ? "text-lg" : "text-xl";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-white flex-shrink-0`}
        style={{ fontFamily: "'Syne', sans-serif" }}>
        R
      </div>
      <span className={`${text} font-black text-white tracking-tight`} style={{ fontFamily: "'Syne', sans-serif" }}>
        Rize<span className="text-orange-400">Up</span>
      </span>
    </div>
  );
}

export default function RizeUpSidebar() {
  const [active,   setActive]   = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500&display=swap');`}</style>

      <div className="flex min-h-screen bg-zinc-950" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden md:flex flex-col w-56 min-h-screen bg-zinc-900 border-r border-white/[0.06] px-3 py-6 flex-shrink-0 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

          <div className="px-2 pb-6 mb-4 border-b border-white/[0.06]">
            <Logo />
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600 px-3 mb-2">Menu</p>
            {navItems.map((item) => (
              <NavItem key={item.label} item={item} active={active} onClick={() => setActive(item.label)} />
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-3">
              <span className="text-2xl leading-none">🔥</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne', sans-serif" }}>12 Days</span>
                <span className="text-zinc-500 text-[11px]">Current streak</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MOBILE TOPBAR ── */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-900 border-b border-white/[0.06] flex items-center justify-between px-4">
          <Logo size="sm" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className={`block w-5 h-0.5 bg-zinc-400 rounded transition-all duration-300 origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-zinc-400 rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-zinc-400 rounded transition-all duration-300 origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* ── MOBILE BACKDROP ── */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />

        {/* ── MOBILE DRAWER ── */}
        <div className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-zinc-900 border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
            <Logo size="sm" />
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 flex items-center justify-center text-sm transition-all"
            >✕</button>
          </div>

          <nav className="flex flex-col gap-1 flex-1 px-3 py-5 overflow-y-auto">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600 px-3 mb-2">Menu</p>
            {navItems.map((item) => (
              <NavItem key={item.label} item={item} active={active} onClick={() => { setActive(item.label); setMenuOpen(false); }} />
            ))}
          </nav>

          <div className="px-3 pb-6 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-3">
              <span className="text-2xl leading-none">🔥</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: "'Syne', sans-serif" }}>12 Days</span>
                <span className="text-zinc-500 text-[11px]">Current streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT (demo) ── */}
        {/* <main className="flex-1 flex flex-col gap-4 p-8 pt-6 md:pt-8 mt-14 md:mt-0">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              {active}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Welcome back — keep the streak alive 🔥</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {["Today's Tasks", "Active Circles", "Streak"].map((card, i) => (
              <div key={card} className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-1">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">{card}</span>
                <span className="text-2xl font-black text-white mt-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {["4 / 7", "3", "12 🔥"][i]}
                </span>
                <div className="mt-2 h-1 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: ["57%", "100%", "80%"][i] }} />
                </div>
              </div>
            ))}
          </div>
        </main> */}

      </div>
    </>
  );
}