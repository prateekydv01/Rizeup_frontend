import { useState, useEffect, useRef } from "react";
import { createCircle } from "../../api/circle.js";

function NoiseGrid({ active }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const COLS = 20, ROWS = 8;
    const cw = W / COLS, ch = H / ROWS;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.current.x * W;
      const my = mouse.current.y * H;
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const bx = c * cw, by = r * ch;
          const wave = Math.sin(c * 0.4 + t) * Math.cos(r * 0.5 + t * 0.7) * 6;
          const dx = bx - mx, dy = by - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - dist / 120) * 16;
          const px = bx - (dx / (dist || 1)) * pull + wave;
          const py = by - (dy / (dist || 1)) * pull + wave * 0.4;
          const intensity = Math.max(0, 1 - dist / 150);
          const alpha = active ? 0.07 + intensity * 0.38 : 0.025 + intensity * 0.07;
          const size = active ? 1 + intensity * 2.4 : 0.6 + intensity * 1;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249,115,22,${alpha})`;
          ctx.fill();
        }
      }
      t += 0.018;
      raf.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: (e.clientX - rect.left) / W, y: (e.clientY - rect.top) / H };
    };
    canvas.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(raf.current); canvas.removeEventListener("mousemove", onMove); };
  }, [active]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-xl" />;
}

function CreateCircle() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createCircle({ name });
      setSuccess(true);
      setName("");
      setTimeout(() => { setSuccess(false); window.location.reload(); }, 1200);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden h-full"
      style={{ border: "1px solid rgba(39,39,42,0.7)", minHeight: 220 }}>
      <NoiseGrid active={focused} />
      <div className="absolute inset-0 rounded-xl" style={{ background: "var(--bg-overlay)" }} />

      <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
        {/* Label + title */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-1.5" style={{ color: "#f97316" }}>New Circle</p>
          <p className="text-base font-black" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
            Start a new circle
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
            A unique code is generated automatically.
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleCreate} className="flex gap-2 mt-auto">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Circle name…"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-700 focus:outline-none transition-all duration-200"
            style={{
              background: "var(--bg-input)",
              border: `1px solid ${focused ? "rgba(249,115,22,0.5)" : "var(--border-hover)"}`,
            }}
          />
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95 disabled:opacity-25 shrink-0"
            style={{
              background: success ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#f97316,#dc2626)",
              boxShadow: name.trim() ? "0 0 12px rgba(249,115,22,0.2)" : "none",
            }}
          >
            {loading ? "…" : success ? "✓" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCircle;