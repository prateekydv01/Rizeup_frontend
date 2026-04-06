import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCircles, leaveCircle, deleteCircle } from "../api/circle";
import { getCurrentUser } from "../api/auth";
import CreateCircle from "../component/Circle/CreateCircle";
import JoinCircle from "../component/Circle/JoinCircle";

function NoiseGrid({ active, hue }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 16 }} />;
}

function CircleCard({ circle, userId, onLeave, onDelete, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const isAdmin = circle.admin === userId;
  const memberCount = circle.members?.length ?? 0;
  const initials = circle.name.slice(0, 2).toUpperCase();
  const hue = circle.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      onClick={onOpen}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        background: "#111113",
        border: `1px solid ${hovered ? `hsla(${hue},50%,50%,0.35)` : "rgba(39,39,42,0.7)"}`,
        boxShadow: hovered ? `0 8px 28px hsla(${hue},60%,40%,0.1)` : "none",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NoiseGrid active={hovered} hue={hue} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "rgba(8,8,9,0.55)" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Avatar + info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 14,
            background: `linear-gradient(135deg, hsla(${hue},60%,45%,${hovered ? 0.3 : 0.18}), hsla(${hue},60%,35%,0.1))`,
            border: `1px solid hsla(${hue},60%,50%,${hovered ? 0.45 : 0.22})`,
            color: `hsl(${hue},70%,${hovered ? 72 : 62}%)`,
            transition: "all 0.25s",
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 14, color: "#f4f4f5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {circle.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
              <span style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.18em", color: "#3f3f46" }}>{circle.code}</span>
              {isAdmin && (
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "1px 6px", borderRadius: 20, background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Member pips */}
        {memberCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            {Array.from({ length: Math.min(memberCount, 7) }).map((_, i) => (
              <div key={i} style={{
                width: 24, height: 24, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700,
                background: `hsla(${(hue + i * 40) % 360},50%,40%,0.25)`,
                border: `1px solid hsla(${(hue + i * 40) % 360},50%,50%,0.2)`,
                color: `hsl(${(hue + i * 40) % 360},60%,65%)`,
              }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {memberCount > 7 && <span style={{ fontSize: 9, color: "#3f3f46" }}>+{memberCount - 7}</span>}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: `hsla(${hue},30%,30%,${hovered ? 0.35 : 0.15})` }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); onLeave(circle._id); }}
            style={{ flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", background: "rgba(24,24,27,0.8)", border: "1px solid rgba(63,63,70,0.5)", color: "#71717a" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f4f4f5"; e.currentTarget.style.borderColor = "rgba(113,113,122,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.borderColor = "rgba(63,63,70,0.5)"; }}
          >
            Leave
          </button>
          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(circle._id); }}
              style={{ flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
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

function MyCirclesList({ userId }) {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCircles = async () => {
    try { const res = await getUserCircles(); setCircles(res.data.data); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCircles(); }, []);

  const handleLeave = async (id) => { await leaveCircle(id).catch(console.log); fetchCircles(); };
  const handleDelete = async (id) => { await deleteCircle(id).catch(console.log); fetchCircles(); };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div style={{ width: 20, height: 20, border: "2px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (circles.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 12 }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed rgba(63,63,70,0.4)" }} />
        <div style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "1px dashed rgba(63,63,70,0.25)" }} />
      </div>
      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3f3f46", margin: 0 }}>No circles yet</p>
      <p style={{ fontSize: 11, color: "#27272a", margin: 0 }}>Create one or join with a code above</p>
    </div>
  );

  return (
    <div style={{
      display: "grid",
      gap: 12,
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    }}>
      {circles.map(circle => (
        <CircleCard
          key={circle._id}
          circle={circle}
          userId={userId}
          onLeave={handleLeave}
          onDelete={handleDelete}
          onOpen={() => navigate(`/circles/${circle._id}`)}
        />
      ))}
    </div>
  );
}

export default function CirclePage() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then(res => setUserId(res.data.data._id))
      .catch(console.log);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans', sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .circle-fade { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(39,39,42,0.8); border-radius: 4px; }
      `}</style>

      {/* Page header */}
      <div style={{
        padding: "32px 28px 24px",
        borderBottom: "1px solid rgba(39,39,42,0.5)",
        background: "linear-gradient(180deg, rgba(249,115,22,0.03) 0%, transparent 100%)",
      }} className="circle-fade">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Mobile: stack, desktop: row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#f97316", margin: "0 0 6px" }}>Community</p>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#f4f4f5", margin: 0, letterSpacing: "-0.02em" }}>
                My Circles
              </h1>
            </div>
            <p style={{ fontSize: 12, color: "#3f3f46", margin: 0 }}>Grow together, accountable together.</p>
          </div>

          {/* Create + Join row — responsive 2-col on md, stack on mobile */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}>
            <CreateCircle />
            <JoinCircle />
          </div>
        </div>
      </div>

      {/* Circles grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 28px 0" }} className="circle-fade">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 2, height: 14, borderRadius: 2, background: "linear-gradient(180deg,#f97316,#dc2626)" }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#52525b", margin: 0 }}>Your Circles</p>
        </div>
        <MyCirclesList userId={userId} />
      </div>
    </div>
  );
}