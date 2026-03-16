import { useSelector } from "react-redux";

export default function StreakCard() {
  const streak = useSelector(state => state.auth?.userData?.streak ?? 0);
  const milestone = 30;
  const pct = Math.round(((streak % milestone) / milestone) * 100);
  const next = milestone - (streak % milestone);

  return (
    <div className="relative rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-200"
      style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}
    >
      <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
        style={{ background: "radial-gradient(circle at top right,rgba(249,115,22,0.07),transparent 70%)" }} />

      <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--text-faint)" }}>Current Streak</p>

      <div className="flex items-center gap-3 my-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
        <div>
          <p className="text-4xl font-black text-white leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{streak}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>consecutive days</p>
        </div>
      </div>

      <div>
        <div className="h-[2px] rounded-full overflow-hidden mb-1.5" style={{ background: "var(--border-default)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#f97316,#ef4444)" }} />
        </div>
        <p className="text-[10px]" style={{ color: "var(--text-ghost)" }}>{next} days to next milestone</p>
      </div>
    </div>
  );
}