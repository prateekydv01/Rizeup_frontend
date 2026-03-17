import { useEffect, useState, useCallback } from "react";
import {
  fetchCalendarEvents, fetchGoogleStatus, fetchGoogleAuthUrl,
  createCalendarEvent, deleteCalendarEvent,
} from "../../api/googleCalendar";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAYS_FULL  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS     = ["January","February","March","April","May","June","July",
                    "August","September","October","November","December"];

const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const sameDay     = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

const parseEventDate = (ev) => {
  const raw = ev.start?.dateTime || ev.start?.date;
  return raw ? new Date(raw) : null;
};

const fmtTime = (ev) => {
  const dt = ev.start?.dateTime;
  if (!dt) return "All day";
  return new Date(dt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const COLOR_MAP = {
  "1":"#a78bfa","2":"#34d399","3":"#60a5fa","4":"#f87171","5":"#facc15",
  "6":"#fb923c","7":"#6ee7b7","8":"#94a3b8","9":"#f472b6","10":"#67e8f9","11":"#a3e635",
};
const eventColor = (ev) => COLOR_MAP[ev.colorId] || "#f97316";

// ── Modals ────────────────────────────────────────────────────────────────────

function EventModal({ event, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const color = eventColor(event);
  const fmt = (dt) => dt ? new Date(dt).toLocaleString("en-US", {
    weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"2-digit", hour12:true,
  }) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(63,63,70,0.8)" }}>
        {/* drag handle on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full" style={{ background: "var(--border-hover)" }} />
        </div>
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
              <p className="text-sm font-black truncate" style={{ fontFamily:"'Syne',sans-serif", color:"var(--text-primary)" }}>
                {event.summary || "Untitled"}
              </p>
            </div>
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 text-xl leading-none shrink-0">×</button>
          </div>
          <p className="text-[10px] mb-4" style={{ color:"var(--text-faint)" }}>
            {fmt(event.start?.dateTime || event.start?.date)}
          </p>
          {event.description && (
            <p className="text-xs mb-4 leading-relaxed" style={{ color:"var(--text-muted)" }}>{event.description}</p>
          )}
          {event.htmlLink && (
            <a href={event.htmlLink} target="_blank" rel="noreferrer"
              className="block text-center w-full py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white mb-2 transition-all"
              style={{ background:"linear-gradient(135deg,#f97316,#dc2626)" }}>
              Open in Google Calendar
            </a>
          )}
          <button onClick={async () => { setDeleting(true); await onDelete(event.id); onClose(); }}
            disabled={deleting}
            className="w-full py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-40"
            style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>
            {deleting ? "Deleting…" : "Delete Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddEventModal({ defaultDate, onClose, onAdded }) {
  const [title,    setTitle]    = useState("");
  const [date,     setDate]     = useState(toDateStr(defaultDate));
  const [time,     setTime]     = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [allDay,   setAllDay]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const inp = {
    background:"var(--bg-input)", border:"1px solid rgba(63,63,70,0.6)", color:"var(--text-primary)",
  };
  const fo = e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
  const bl = e => e.currentTarget.style.borderColor = "var(--border-hover)";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createCalendarEvent({ title, date, time: allDay ? "00:00" : time, duration: allDay ? 1440 : Number(duration) });
      onAdded(); onClose();
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ background:"linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border:"1px solid rgba(63,63,70,0.8)" }}>
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-8 h-1 rounded-full" style={{ background:"var(--border-hover)" }} />
        </div>
        <div className="h-[1.5px]" style={{ background:"linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />
        <div className="p-5 pb-8 sm:pb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black" style={{ fontFamily:"'Syne',sans-serif", color:"var(--text-primary)" }}>New Event</p>
            <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 text-xl leading-none">×</button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Event title…" required autoFocus
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition"
              style={inp} onFocus={fo} onBlur={bl} />
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[9px] font-bold tracking-widest uppercase" style={{ color:"var(--text-faint)" }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className="px-2.5 py-2 rounded-lg text-xs focus:outline-none transition w-full"
                  style={inp} onFocus={fo} onBlur={bl} />
              </div>
              {!allDay && (
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase" style={{ color:"var(--text-faint)" }}>Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    className="px-2.5 py-2 rounded-lg text-xs focus:outline-none transition w-full"
                    style={inp} onFocus={fo} onBlur={bl} />
                </div>
              )}
            </div>
            {!allDay && (
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold tracking-widest uppercase" style={{ color:"var(--text-faint)" }}>Duration (min)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
                  min={15} max={480} step={15}
                  className="px-2.5 py-2 rounded-lg text-xs focus:outline-none transition"
                  style={inp} onFocus={fo} onBlur={bl} />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setAllDay(!allDay)}
                className="w-8 h-4 rounded-full transition-all duration-200 relative"
                style={{ background: allDay ? "linear-gradient(135deg,#f97316,#dc2626)" : "var(--border-default)" }}>
                <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200"
                  style={{ left: allDay ? "18px" : "2px" }} />
              </div>
              <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>All day</span>
            </label>
            <div className="flex gap-2 mt-1">
              <button type="submit" disabled={loading || !title.trim()}
                className="flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95 disabled:opacity-30"
                style={{ background:"linear-gradient(135deg,#f97316,#dc2626)" }}>
                {loading ? "Creating…" : "Create Event"}
              </button>
              <button type="button" onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all"
                style={{ background:"var(--border-default)", border:"1px solid rgba(63,63,70,0.5)", color:"var(--text-muted)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Day Cell — desktop full, mobile compact ───────────────────────────────────

function DayCell({ date, isCurrentMonth, events, isToday, isMobile, onDayClick, onEventClick, isSelected }) {
  const dayEvents = events.filter(ev => {
    const d = parseEventDate(ev);
    return d && sameDay(d, date);
  });

  if (isMobile) {
    // Mobile: compact circle with dot indicator
    return (
      <div onClick={() => onDayClick(date)}
        className="flex flex-col items-center gap-0.5 py-1 cursor-pointer select-none"
      >
        <span
          className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all"
          style={isToday
            ? { background:"linear-gradient(135deg,#f97316,#dc2626)", color:"white" }
            : isSelected
            ? { background:"rgba(249,115,22,0.15)", color:"#fb923c", border:"1px solid rgba(249,115,22,0.3)" }
            : { color: isCurrentMonth ? "var(--text-secondary)" : "var(--text-ghost)" }
          }
        >
          {date.getDate()}
        </span>
        {/* Event dot */}
        <div className="flex gap-0.5">
          {dayEvents.slice(0, 3).map((ev, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ background: eventColor(ev) }} />
          ))}
        </div>
      </div>
    );
  }

  // Desktop: full cell with event chips
  return (
    <div onClick={() => onDayClick(date)}
      className="relative flex flex-col p-1.5 cursor-pointer transition-all duration-150"
      style={{
        minHeight: "90px",
        background: isToday ? "rgba(249,115,22,0.04)" : "transparent",
        border: "1px solid rgba(39,39,42,0.5)",
        borderRadius: "8px",
      }}
      onMouseEnter={e => e.currentTarget.style.background = isToday ? "rgba(249,115,22,0.07)" : "rgba(255,255,255,0.02)"}
      onMouseLeave={e => e.currentTarget.style.background = isToday ? "rgba(249,115,22,0.04)" : "transparent"}
    >
      <span
        className="w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold mb-1"
        style={isToday
          ? { background:"linear-gradient(135deg,#f97316,#dc2626)", color:"white" }
          : { color: isCurrentMonth ? "var(--text-secondary)" : "var(--text-ghost)" }
        }
      >
        {date.getDate()}
      </span>
      <div className="flex flex-col gap-0.5 overflow-hidden">
        {dayEvents.slice(0, 3).map(ev => (
          <div key={ev.id}
            onClick={e => { e.stopPropagation(); onEventClick(ev); }}
            className="px-1.5 py-0.5 rounded text-[9px] font-semibold truncate transition-all"
            style={{
              background:`${eventColor(ev)}22`, border:`1px solid ${eventColor(ev)}44`, color:eventColor(ev),
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${eventColor(ev)}33`}
            onMouseLeave={e => e.currentTarget.style.background = `${eventColor(ev)}22`}
          >
            {fmtTime(ev) !== "All day" && <span className="opacity-60 mr-1">{fmtTime(ev)}</span>}
            {ev.summary || "Untitled"}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <span className="text-[9px] px-1" style={{ color:"var(--text-faint)" }}>+{dayEvents.length - 3} more</span>
        )}
      </div>
    </div>
  );
}

// ── Mobile Day Event List ─────────────────────────────────────────────────────

function MobileDayEvents({ date, events, onEventClick, onAddClick }) {
  const dayEvents = events.filter(ev => {
    const d = parseEventDate(ev);
    return d && sameDay(d, date);
  });

  return (
    <div className="mt-3 rounded-xl overflow-hidden"
      style={{ background:"rgba(18,18,20,0.8)", border:"1px solid rgba(39,39,42,0.6)" }}>
      <div className="flex items-center justify-between px-3 py-2.5"
        style={{ borderBottom:"1px solid rgba(39,39,42,0.5)" }}>
        <p className="text-xs font-bold" style={{ fontFamily:"'Syne',sans-serif", color:"var(--text-secondary)" }}>
          {date.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}
        </p>
        <button onClick={onAddClick}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-all active:scale-90"
          style={{ background:"linear-gradient(135deg,#f97316,#dc2626)" }}>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {dayEvents.length === 0 ? (
        <p className="text-[10px] text-center py-4" style={{ color:"var(--text-ghost)" }}>No events — tap + to add</p>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor:"rgba(39,39,42,0.4)" }}>
          {dayEvents.map(ev => (
            <div key={ev.id} onClick={() => onEventClick(ev)}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all active:bg-white/5">
              <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background:eventColor(ev) }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color:"var(--text-primary)" }}>{ev.summary || "Untitled"}</p>
                <p className="text-[10px] mt-0.5" style={{ color:"var(--text-faint)" }}>{fmtTime(ev)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function GoogleCalendarView() {
  const [connected,    setConnected]    = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [events,       setEvents]       = useState([]);
  const [evLoading,    setEvLoading]    = useState(false);
  const [currentDate,  setCurrentDate]  = useState(new Date());
  const [selectedEv,   setSelectedEv]   = useState(null);
  const [addDate,      setAddDate]      = useState(null);
  const [selectedDay,  setSelectedDay]  = useState(new Date()); // mobile selected day

  useEffect(() => {
    fetchGoogleStatus()
      .then(r => {
        const isConnected = r.data.data.connected;
        setConnected(isConnected);
        if (isConnected) loadEvents(new Date());
      })
      .catch(() => setConnected(false))
      .finally(() => setLoading(false));
    if (window.location.search.includes("googleConnected=true")) {
      setConnected(true);
      loadEvents(new Date());
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const loadEvents = useCallback(async (date) => {
    setEvLoading(true);
    try {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end   = new Date(date.getFullYear(), date.getMonth() + 2, 0);
      const r     = await fetchCalendarEvents(start.toISOString(), end.toISOString());
      setEvents(r.data.data);
    } catch (e) {
      // If calendar not connected or token invalid, reset to disconnected state
      if (e.response?.status === 500 || e.response?.status === 400) {
        setConnected(false);
        setEvents([]);
      }
    }
    finally { setEvLoading(false); }
  }, []);

  const handleConnect  = async () => { const r = await fetchGoogleAuthUrl(); window.location.href = r.data.data.url; };
  const handleDeleteEv = async (id) => { await deleteCalendarEvent(id); setEvents(p => p.filter(e => e.id !== id)); };

  const navigate = (dir) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1);
    setCurrentDate(d);
    if (connected) loadEvents(d);
  };

  const goToday = () => { setCurrentDate(new Date()); setSelectedDay(new Date()); if (connected) loadEvents(new Date()); };

  // Build grid
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const today       = new Date();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true });
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false });

  if (loading) return null;

  const Header = () => (
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <h2 className="font-black text-base sm:text-lg" style={{ fontFamily:"'Syne',sans-serif", color:"var(--text-primary)" }}>
          {MONTHS[month]} <span style={{ color:"var(--text-faint)" }}>{year}</span>
        </h2>
        {evLoading && <div className="w-3 h-3 rounded-full border border-orange-500 border-t-transparent animate-spin" />}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={goToday}
          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all"
          style={{ background:"var(--border-default)", border:"1px solid rgba(63,63,70,0.5)", color:"var(--text-muted)" }}
          onMouseEnter={e => { e.currentTarget.style.color="var(--text-primary)"; e.currentTarget.style.borderColor="rgba(113,113,122,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="var(--text-muted)"; e.currentTarget.style.borderColor="var(--border-hover)"; }}>
          Today
        </button>
        <div className="flex" style={{ background:"var(--border-subtle)", border:"1px solid rgba(63,63,70,0.4)", borderRadius:"10px" }}>
          {[-1, 1].map((dir, i) => (
            <button key={dir} onClick={() => navigate(dir)}
              className={`w-8 h-8 flex items-center justify-center transition-all ${i === 0 ? "rounded-l-[9px]" : "rounded-r-[9px]"}`}
              style={{ color:"var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-muted)"; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {dir === -1 ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
              </svg>
            </button>
          ))}
        </div>
        {!connected ? (
          <button onClick={handleConnect}
            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95"
            style={{ background:"linear-gradient(135deg,#f97316,#dc2626)" }}>
            Connect
          </button>
        ) : (
          <button onClick={() => setAddDate(new Date())}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95"
            style={{ background:"linear-gradient(135deg,#f97316,#dc2626)" }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="hidden sm:inline">New Event</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {selectedEv && <EventModal event={selectedEv} onClose={() => setSelectedEv(null)} onDelete={handleDeleteEv} />}
      {addDate && connected && (
        <AddEventModal defaultDate={addDate} onClose={() => setAddDate(null)} onAdded={() => loadEvents(currentDate)} />
      )}

      <div className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{ background:"linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border:"1px solid rgba(39,39,42,0.9)" }}>
        <div className="h-[1.5px]" style={{ background:"linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

        <div className="p-3 sm:p-4">
          <Header />

          {/* ── Day labels ── */}
          <div className="grid grid-cols-7 mb-1">
            {(window.innerWidth < 640 ? DAYS_SHORT : DAYS_FULL).map((d, i) => (
              <div key={i} className="text-center py-1.5">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color:"var(--text-ghost)" }}>{d}</span>
              </div>
            ))}
          </div>

          {/* ── Not connected overlay ── */}
          {!connected && (
            <div className="relative">
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 opacity-10 pointer-events-none select-none">
                {cells.map(({ date, current }, i) => (
                  <DayCell key={i} date={date} isCurrentMonth={current} events={[]}
                    isToday={sameDay(date, today)} isMobile={false}
                    onDayClick={() => {}} onEventClick={() => {}} isSelected={false} />
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
                <p className="text-xs sm:text-sm font-black text-center" style={{ fontFamily:"'Syne',sans-serif", color:"var(--text-faint)" }}>
                  Connect Google Calendar to see events
                </p>
                <button onClick={handleConnect}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95"
                  style={{ background:"linear-gradient(135deg,#f97316,#dc2626)", boxShadow:"0 0 20px rgba(249,115,22,0.25)" }}>
                  Connect Now
                </button>
              </div>
            </div>
          )}

          {/* ── MOBILE: compact dots grid + day event list ── */}
          {connected && (
            <>
              {/* Mobile grid */}
              <div className="grid grid-cols-7 sm:hidden">
                {cells.map(({ date, current }, i) => (
                  <DayCell key={i} date={date} isCurrentMonth={current} events={events}
                    isToday={sameDay(date, today)} isMobile={true}
                    isSelected={sameDay(date, selectedDay)}
                    onDayClick={(d) => setSelectedDay(d)}
                    onEventClick={setSelectedEv} />
                ))}
              </div>

              {/* Mobile selected day events */}
              <div className="sm:hidden">
                <MobileDayEvents
                  date={selectedDay}
                  events={events}
                  onEventClick={setSelectedEv}
                  onAddClick={() => setAddDate(selectedDay)}
                />
              </div>

              {/* Desktop full grid */}
              <div className="hidden sm:grid grid-cols-7 gap-1">
                {cells.map(({ date, current }, i) => (
                  <DayCell key={i} date={date} isCurrentMonth={current} events={events}
                    isToday={sameDay(date, today)} isMobile={false}
                    isSelected={false}
                    onDayClick={(d) => setAddDate(d)}
                    onEventClick={setSelectedEv} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}