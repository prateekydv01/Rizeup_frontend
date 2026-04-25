import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { postDailyCheckIn, fetchDailyCheckInStatus } from "../../api/checkIn";
import { setUserData } from "../../store/auth.slice";

function CircleProgress({ pct }) {
  const r = 30, c = 2 * Math.PI * r, dash = (pct / 100) * c;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="flex-shrink-0">
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="5" />
      <circle cx="38" cy="38" r={r} fill="none" stroke="url(#pg)" strokeWidth="5"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 38 38)" />
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <text x="38" y="43" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="800"
        style={{ fontFamily: "'Syne', sans-serif" }}>{pct}%</text>
    </svg>
  );
}

export default function DailyProgress({ todaySectionId }) {
  const dispatch  = useDispatch();
  const userData  = useSelector(state => state.auth.userData);

  // Real-time todo progress from Redux
  const todos = useSelector(state =>
    todaySectionId ? (state.todos.todosBySection[todaySectionId] || []) : null
  );
  const total = todos ? todos.length : 0;
  const done  = todos ? todos.filter(t => t.completed).length : 0;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  const [checkedIn,  setCheckedIn]  = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // On every mount (= every login / navigation to home): fetch fresh check-in status + streak
  useEffect(() => {
    fetchDailyCheckInStatus()
      .then(r => {
        const { checkedIn, streak } = r.data.data;
        setCheckedIn(checkedIn);
        // Always sync latest streak from server into Redux → StreakCard updates instantly
        if (streak !== undefined) {
          dispatch(setUserData({ streak }));
        }
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckIn = async () => {
    if (checkedIn || submitting) return;
    setSubmitting(true);
    try {
      const r = await postDailyCheckIn();
      const { streak } = r.data.data;
      setCheckedIn(true);
      if (streak !== undefined) {
        dispatch(setUserData({ streak }));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  const todoLabel = !todaySectionId
    ? 'No "Today" section yet'
    : total === 0
    ? "No tasks in Today"
    : `${done} of ${total} done`;

  return (
    <div className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden transition-all duration-200"
      style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}
    >
      <div className="absolute top-0 left-0 right-0 h-[1.5px] rounded-t-2xl"
        style={{ background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "var(--text-faint)" }}>
            Today's Progress
          </p>
          <p className="text-zinc-400 text-xs mt-1">{todoLabel}</p>
        </div>
        <CircleProgress pct={pct} />
      </div>

      <button
        onClick={handleCheckIn}
        disabled={checkedIn || submitting || loading}
        className="w-full py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-200 active:scale-[0.98] disabled:cursor-default"
        style={checkedIn
          ? { background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }
          : { background: "linear-gradient(135deg,#f97316,#dc2626)", color: "white", boxShadow: "0 0 16px rgba(249,115,22,0.18)" }
        }>
        {loading ? "…" : submitting ? "Checking in…" : checkedIn ? "✓ Checked In Today" : "Daily Check-In"}
      </button>
    </div>
  );
}