import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth.slice";
import { logoutUser } from "../../api/auth";

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const PlannerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="14" y2="18" />
  </svg>
);
const GoalsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const HabitsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const CirclesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="13" cy="16" r="3" />
    <line x1="9" y1="10" x2="13" y2="13" /><line x1="17" y1="10" x2="13" y2="13" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const navItems = [
  { label: "Home",          icon: <HomeIcon />,      path: "/",              badge: null },
  { label: "My Planner",   icon: <PlannerIcon />,   path: "/planner",       badge: null },
  { label: "My Goals",     icon: <GoalsIcon />,     path: "/goals",         badge: null },
  { label: "My Habits",    icon: <HabitsIcon />,    path: "/habits",        badge: null },
  { label: "Circles",      icon: <CirclesIcon />,   path: "/circles",       badge: null },
  { label: "Analytics",    icon: <AnalyticsIcon />, path: "/analytics",     badge: null },
  { label: "Notifications",icon: <BellIcon />,      path: "/notifications", badge: 3   },
];

function NavItem({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl relative cursor-pointer text-left transition-all duration-200"
      style={{
        background: isActive ? "rgba(249,115,22,0.1)" : "transparent",
        border: isActive ? "1px solid rgba(249,115,22,0.2)" : "1px solid transparent",
        color: isActive ? "#fdba74" : "#71717a",
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#d4d4d8"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.background = "transparent"; }}}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full"
          style={{ background: "linear-gradient(180deg, #f97316, #ef4444)" }} />
      )}
      <span className="flex-shrink-0" style={{ color: isActive ? "#f97316" : "inherit" }}>{item.icon}</span>
      <span className="flex-1 font-medium truncate" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>{item.label}</span>
      {item.badge && (
        <span className="text-[10px] font-bold text-white rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
          style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white flex-shrink-0"
        style={{ fontFamily: "'Syne', sans-serif", background: "linear-gradient(135deg, #f97316, #dc2626)", fontSize: "14px" }}>
        R
      </div>
      <span className="text-base font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
        Rize<span style={{ color: "#f97316" }}>Up</span>
      </span>
    </div>
  );
}

export default function RizeUpSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const streak = useSelector(state => state.auth?.userData?.streak ?? 0);

  const handleNav = (path) => { navigate(path); setMenuOpen(false); };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate("/login");
  };

  const NavList = () => (
    <>
      <nav className="flex flex-col gap-0.5 flex-1">
        <p className="text-[9px] font-bold tracking-[0.3em] uppercase px-2.5 mb-1.5" style={{ color: "#3f3f46" }}>
          Menu
        </p>
        {navItems.map(item => (
          <NavItem key={item.label} item={item} isActive={location.pathname === item.path} onClick={() => handleNav(item.path)} />
        ))}
      </nav>

      <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5"
          style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-white font-bold text-xs" style={{ fontFamily: "'Syne', sans-serif" }}>{streak} {streak === 1 ? "Day" : "Days"}</span>
            <span className="text-[10px]" style={{ color: "#52525b" }}>Current streak</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-200"
          style={{ background: "transparent", border: "1px solid transparent", color: "#52525b" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.08)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#52525b"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen flex-shrink-0 relative px-3 py-5"
        style={{ background: "#0e0e10", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)" }} />
        <div className="px-1 pb-4 mb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <Logo />
        </div>
        <NavList />
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ height: "52px", background: "#0e0e10", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Logo />
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-lg"
          style={{ color: "#71717a" }}>
          <span className={`block w-4 h-[1.5px] bg-current rounded transition-all duration-300 origin-center ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`block w-4 h-[1.5px] bg-current rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-4 h-[1.5px] bg-current rounded transition-all duration-300 origin-center ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* ── MOBILE BACKDROP ── */}
      <div onClick={() => setMenuOpen(false)} className="md:hidden fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }} />

      {/* ── MOBILE DRAWER ── */}
      <div className="md:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col px-3 py-5 transition-transform duration-300 ease-in-out"
        style={{ background: "#0e0e10", borderRight: "1px solid rgba(255,255,255,0.04)", transform: menuOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div className="flex items-center justify-between px-1 pb-4 mb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <Logo />
          <button onClick={() => setMenuOpen(false)} className="w-6 h-6 rounded-md flex items-center justify-center text-xs transition-all"
            style={{ color: "#52525b", border: "1px solid rgba(63,63,70,0.5)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4d4d8"}
            onMouseLeave={e => e.currentTarget.style.color = "#52525b"}>
            ✕
          </button>
        </div>
        <NavList />
      </div>
    </>
  );
}