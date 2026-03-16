import { useNavigate } from "react-router-dom";

const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: <FlameIcon />, label: "Streak tracking"         },
    { icon: <CheckIcon />, label: "Daily planner"           },
    { icon: <TargetIcon />, label: "Goal progress"          },
    { icon: <UsersIcon />, label: "Accountability circles"  },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080809", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white"
            style={{ background: "linear-gradient(135deg,#f97316,#dc2626)", fontFamily: "'Syne', sans-serif", fontSize: "15px" }}>
            R
          </div>
          <span className="text-lg font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Rize<span style={{ color: "#f97316" }}>Up</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ color: "#a1a1aa", border: "1px solid rgba(63,63,70,0.6)", background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(82,82,91,0.9)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)"; }}>
            Sign in
          </button>
          <button onClick={() => navigate("/signup")}
            className="px-4 py-1.5 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#f97316,#dc2626)" }}>
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
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#f97316" }}>
            Your daily accountability OS
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="font-black tracking-tight"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.4rem,7vw,4.5rem)",
              lineHeight: 1.05,
              background: "linear-gradient(110deg,#ffffff 0%,#fb923c 50%,#ef4444 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
            Rise every single day.
          </h1>
          <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: "#71717a" }}>
            Track habits, crush goals, and stay accountable with your circles. Build the streak that defines you.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button onClick={() => navigate("/signup")}
            className="px-7 py-3 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#f97316,#dc2626)", boxShadow: "0 0 24px rgba(249,115,22,0.2)" }}>
            Start for free →
          </button>
          <button onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ color: "#a1a1aa", border: "1px solid rgba(63,63,70,0.6)", background: "transparent" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(82,82,91,0.9)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)"; }}>
            Sign in
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {features.map(({ icon, label }) => (
            <span key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(39,39,42,0.9)", color: "#71717a" }}>
              <span style={{ color: "#52525b" }}>{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </main>

      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg,transparent,rgba(249,115,22,0.3),transparent)" }} />
    </div>
  );
}