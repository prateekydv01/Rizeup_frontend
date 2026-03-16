import { useEffect, useState, useRef } from "react";
import { getUserCircles, leaveCircle, deleteCircle } from "../../api/circle";
import { getCurrentUser } from "../../api/auth";

function NoiseGrid({ active, hue }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const COLS = 16, ROWS = 8;
    const cw = W / COLS, ch = H / ROWS;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.current.x * W;
      const my = mouse.current.y * H;
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const bx = c * cw, by = r * ch;
          const wave = Math.sin(c * 0.45 + t) * Math.cos(r * 0.55 + t * 0.8) * 5;
          const dx = bx - mx, dy = by - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - dist / 110) * 14;
          const px = bx - (dx / (dist || 1)) * pull + wave;
          const py = by - (dy / (dist || 1)) * pull + wave * 0.4;
          const intensity = Math.max(0, 1 - dist / 130);
          const alpha = active ? 0.06 + intensity * 0.3 : 0.02 + intensity * 0.05;
          const size = active ? 1 + intensity * 2 : 0.6 + intensity * 0.8;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue},65%,55%,${alpha})`;
          ctx.fill();
        }
      }
      t += 0.02;
      raf.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: (e.clientX - rect.left) / W, y: (e.clientY - rect.top) / H };
    };
    canvas.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(raf.current); canvas.removeEventListener("mousemove", onMove); };
  }, [active, hue]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-xl" />;
}

function CircleCard({ circle, userId, onLeave, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const isAdmin = circle.admin === userId;
  const memberCount = circle.members?.length ?? 0;
  const initials = circle.name.slice(0, 2).toUpperCase();
  const hue = circle.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="relative flex flex-col gap-3 p-4 rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "var(--bg-card-alt)",
        border: `1px solid ${hovered ? `hsla(${hue},50%,50%,0.3)` : "var(--border-default)"}`,
        boxShadow: hovered ? `0 4px 24px hsla(${hue},60%,40%,0.08)` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NoiseGrid active={hovered} hue={hue} />
      <div className="absolute inset-0 rounded-xl" style={{ background: "var(--bg-overlay)" }} />

      <div className="relative z-10 flex flex-col gap-2.5">
        {/* Avatar + info */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: `linear-gradient(135deg, hsla(${hue},60%,45%,${hovered ? 0.3 : 0.15}), hsla(${hue},60%,35%,0.1))`,
              border: `1px solid hsla(${hue},60%,50%,${hovered ? 0.4 : 0.2})`,
              color: `hsl(${hue},70%,${hovered ? 70 : 60}%)`,
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
              {circle.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono tracking-[0.18em]" style={{ color: "var(--text-faint)" }}>{circle.code}</span>
              {isAdmin && (
                <span className="text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Member pips */}
        {memberCount > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {Array.from({ length: Math.min(memberCount, 8) }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{
                  background: `hsla(${(hue + i * 35) % 360},50%,40%,0.25)`,
                  border: `1px solid hsla(${(hue + i * 35) % 360},50%,50%,0.2)`,
                  color: `hsl(${(hue + i * 35) % 360},60%,65%)`,
                }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {memberCount > 8 && <span className="text-[9px]" style={{ color: "var(--text-ghost)" }}>+{memberCount - 8}</span>}
          </div>
        )}

        {/* Divider */}
        <div className="h-px" style={{ background: `hsla(${hue},30%,30%,${hovered ? 0.35 : 0.15})` }} />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onLeave(circle._id)}
            className="flex-1 py-2 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all duration-150 active:scale-95"
            style={{ background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "rgba(113,113,122,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
          >
            Leave
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(circle._id)}
              className="flex-1 py-2 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all duration-150 active:scale-95"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#dc2626"; }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MyCircles() {
  const [circles, setCircles] = useState([]);
  const [userId, setUserId] = useState("");

  const fetchCircles = async () => {
    try { const res = await getUserCircles(); setCircles(res.data.data); }
    catch (e) { console.log(e); }
  };

  const fetchUser = async () => {
    try { const res = await getCurrentUser(); setUserId(res.data.data._id); }
    catch (e) { console.log(e); }
  };

  useEffect(() => { fetchCircles(); fetchUser(); }, []);

  const handleLeave = async (id) => { await leaveCircle(id).catch(console.log); fetchCircles(); };
  const handleDelete = async (id) => { await deleteCircle(id).catch(console.log); fetchCircles(); };

  if (circles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full" style={{ border: "1px dashed rgba(63,63,70,0.4)" }} />
          <div className="absolute inset-3 rounded-full" style={{ border: "1px dashed rgba(63,63,70,0.25)" }} />
        </div>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-ghost)" }}>No circles yet</p>
        <p className="text-[10px]" style={{ color: "var(--text-ghost)" }}>Create one or join with a code</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {circles.map(circle => (
        <CircleCard key={circle._id} circle={circle} userId={userId} onLeave={handleLeave} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default MyCircles;