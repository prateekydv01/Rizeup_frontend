import { useEffect, useState } from "react";
import { getUserCircles } from "../../api/circle";
import { getMyHabits } from "../../api/habit";

const FlameIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const TargetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const UsersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function StatsCard() {
  const [circles, setCircles] = useState("—");
  const [habits,  setHabits]  = useState("—");

  useEffect(() => {
    getUserCircles()
      .then(r => setCircles(r.data.data.length))
      .catch(() => setCircles(0));

    getMyHabits()
      .then(r => setHabits(r.data.data.filter(h => h.isActive).length))
      .catch(() => setHabits(0));
  }, []);

  const rows = [
    { icon: <FlameIcon />,  label: "Habits ongoing",  value: habits  },
    { icon: <TargetIcon />, label: "Goals active",     value: "—"     },
    { icon: <UsersIcon />,  label: "Circles joined",   value: circles },
  ];

  return (
    <div className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden transition-all duration-200"
      style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}
    >
      <div className="absolute top-0 left-0 right-0 h-[1.5px] rounded-t-2xl"
        style={{ background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

      <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--text-faint)" }}>Overview</p>

      <div className="flex flex-col gap-1 flex-1 justify-center">
        {rows.map(({ icon, label, value }, i) => (
          <div key={label}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(39,39,42,0.6)" : "none" }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              {icon}
              <span className="text-xs">{label}</span>
            </div>
            <span className="font-bold text-sm" style={{ color: "#f97316" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}