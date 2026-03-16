import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodoSections, createTodoSection } from "../api/todoSection";
import { setSections, addSection } from "../store/todoSection.slice";
import TodoSection from "../component/Todo/TodoSection";
import GoogleCalendarView from "../component/Todo/GoogleCalendarView";

function AddSectionCard({ creating, setCreating, title, setTitle, handleCreateSection }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ minHeight: "90px", border: "1px dashed rgba(63,63,70,0.4)", background: "var(--bg-card-alt)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)"; e.currentTarget.style.background = "rgba(249,115,22,0.02)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "var(--bg-card-alt)"; }}
    >
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #52525b 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

      <div className="relative z-10 flex items-center justify-center p-5" style={{ minHeight: "90px" }}>
        {!creating ? (
          <button onClick={() => setCreating(true)} className="flex flex-col items-center gap-1.5 group">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ border: "1px dashed rgba(113,113,122,0.4)", color: "var(--text-faint)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; e.currentTarget.style.color = "#f97316"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-faint)"; }}
            >
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: "var(--text-ghost)" }}>
              New Section
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section name..."
              autoFocus
              className="w-full px-2.5 py-1.5 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
              style={{ background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.8)", fontFamily: "'Syne', sans-serif" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleCreateSection}
                className="flex-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide text-white uppercase transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
              >
                Create
              </button>
              <button
                onClick={() => setCreating(false)}
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150"
                style={{ background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.6)", color: "var(--text-muted)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "rgba(82,82,91,0.8)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Planner() {
  const dispatch = useDispatch();
  const sections = useSelector(state => state.todoSections.sections);

  // Flat list of all todos across all sections — passed to GoogleCalendarPanel
  const allTodos = useSelector(state => {
    const bySection = state.todos.todosBySection;
    return Object.values(bySection).flat();
  });

  const [title,    setTitle]    = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      const res = await getTodoSections();
      dispatch(setSections(res.data.data));
    };
    fetchSections();
  }, [dispatch]);

  const handleCreateSection = async () => {
    if (!title.trim()) return;
    const res = await createTodoSection({ title, type: "custom" });
    dispatch(addSection(res.data.data));
    setTitle("");
    setCreating(false);
  };

  const cardProps = { creating, setCreating, title, setTitle, handleCreateSection };

  const intoColumns = (n) => {
    const cols = Array.from({ length: n }, () => []);
    sections.forEach((s, i) => cols[i % n].push(s));
    return cols;
  };

  return (
    <div
      className="text-zinc-200 px-4 sm:px-10 md:px-14 lg:px-20 pt-7 pb-12"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg-base)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }
      `}</style>

      {/* Glow orb */}
      <div className="fixed top-0 left-[20%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />

      <div className="relative z-10">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 rounded-full" style={{ background: "#f97316" }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "#f97316" }}>Rize Up</span>
          </div>
          <h1
            className="font-black tracking-tight mb-2 page-title"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.75rem",
              background: "linear-gradient(110deg, #ffffff 0%, #fb923c 45%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            My Planner
          </h1>
          <p className="text-zinc-500 text-xs tracking-wide">Organize. Focus. Rise every day.</p>
        </div>

        {/* Todos divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-px h-3" style={{ background: "rgba(249,115,22,0.6)" }} />
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--text-faint)" }}>Todos</span>
          </div>
          <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
        </div>

        {/* DESKTOP 3-col masonry */}
        <div className="hidden xl:flex gap-3 items-start">
          {intoColumns(3).map((col, ci) => (
            <div key={ci} className="flex-1 min-w-0 flex flex-col gap-3">
              {col.map(section => <TodoSection key={section._id} section={section} />)}
              {ci === sections.length % 3 && <AddSectionCard {...cardProps} />}
            </div>
          ))}
        </div>

        {/* TABLET 2-col masonry */}
        <div className="hidden md:flex xl:hidden gap-3 items-start">
          {intoColumns(2).map((col, ci) => (
            <div key={ci} className="flex-1 min-w-0 flex flex-col gap-3">
              {col.map(section => <TodoSection key={section._id} section={section} />)}
              {ci === sections.length % 2 && <AddSectionCard {...cardProps} />}
            </div>
          ))}
        </div>

        {/* MOBILE 1-col */}
        <div className="flex md:hidden flex-col gap-3">
          {sections.map(section => <TodoSection key={section._id} section={section} />)}
          <AddSectionCard {...cardProps} />
        </div>

        {/* ── Google Calendar — below todos ── */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-px h-3" style={{ background: "rgba(249,115,22,0.6)" }} />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--text-faint)" }}>Google Calendar</span>
            </div>
            <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
          </div>
          <GoogleCalendarView />
        </div>

      </div>
    </div>
  );
}

export default Planner;