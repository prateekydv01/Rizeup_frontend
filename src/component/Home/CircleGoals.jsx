import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCircles } from "../../api/circle";

const UsersIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function CircleGoals() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserCircles()
      .then(r => setCircles(r.data.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (circles.length === 0) return null;

  return (
    <section className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Circles</h2>
        <button onClick={() => navigate("/circles")}
          className="text-[10px] font-semibold transition-colors duration-150"
          style={{ color: "#f97316" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
          onMouseLeave={e => e.currentTarget.style.color = "#f97316"}>
          View all →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {circles.slice(0, 4).map(circle => {
          const hue = circle.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
          const initials = circle.name.slice(0, 2).toUpperCase();
          const memberCount = circle.members?.length ?? 0;

          return (
            <div key={circle._id}
              onClick={() => navigate(`/circles/${circle._id}`)}
              className="rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 cursor-pointer"
              style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `hsla(${hue},50%,50%,0.3)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: `linear-gradient(135deg, hsla(${hue},60%,45%,0.2), hsla(${hue},60%,35%,0.1))`,
                  border: `1px solid hsla(${hue},60%,50%,0.25)`,
                  color: `hsl(${hue},70%,65%)`,
                }}>
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
                  {circle.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span style={{ color: "var(--text-faint)" }}><UsersIcon /></span>
                  <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{memberCount} members</span>
                  <span className="text-[9px] font-mono tracking-widest ml-1" style={{ color: "var(--text-ghost)" }}>{circle.code}</span>
                </div>
              </div>

              {/* Arrow indicator */}
              <span className="text-[11px] transition-all duration-200 flex-shrink-0" style={{ color: "var(--text-ghost)" }}>→</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}