import { useState, useRef, useEffect } from "react";
import { joinCircle } from "../../api/circle";

const CODE_LEN = 6;

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

function JoinCircle() {
  const [chars, setChars] = useState(Array(CODE_LEN).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputs = useRef([]);

  const handleChange = (i, val) => {
    const v = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const next = [...chars];
    next[i] = v;
    setChars(next);
    setError("");
    if (v && i < CODE_LEN - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LEN);
    const next = [...chars];
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setChars(next);
    inputs.current[Math.min(pasted.length, CODE_LEN - 1)]?.focus();
    e.preventDefault();
  };

  const filled = chars.every(c => c !== "");

  const handleJoin = async () => {
    if (!filled) return;
    setLoading(true);
    try {
      await joinCircle({ code: chars.join("") });
      setChars(Array(CODE_LEN).fill(""));
      setError("");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code.");
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
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase mb-1.5" style={{ color: "#f97316" }}>Have a Code?</p>
          <p className="text-base font-black" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}>
            Enter a circle code
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
            Paste or type your 6-character invite.
          </p>
        </div>

        {/* Slots + button */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex gap-1.5">
            {chars.map((ch, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                value={ch}
                maxLength={1}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-11 h-12 rounded-lg text-center text-xs font-black uppercase focus:outline-none transition-all duration-150 caret-transparent"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: ch ? "rgba(249,115,22,0.08)" : "var(--bg-input)",
                  border: `1px solid ${ch ? "rgba(249,115,22,0.45)" : error ? "rgba(239,68,68,0.35)" : "var(--border-hover)"}`,
                  color: ch ? "#fb923c" : "var(--text-faint)",
                }}
              />
            ))}
          </div>

          {error && <p className="text-[10px]" style={{ color: "#f87171" }}>{error}</p>}

          <button
            onClick={handleJoin}
            disabled={!filled || loading}
            className="w-fit px-5 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95 disabled:opacity-25"
            style={{
              background: "linear-gradient(135deg,#f97316,#dc2626)",
              boxShadow: filled ? "0 0 12px rgba(249,115,22,0.2)" : "none",
            }}
          >
            {loading ? "Joining…" : "Join Circle"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinCircle;