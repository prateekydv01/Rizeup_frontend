import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTodoSections } from "../../api/todoSection";
import { getSectionTodos } from "../../api/todo";
import { toggleTodo, createTodo } from "../../api/todo";
import { setTodos, addTodo, updateTodo } from "../../store/todo.slice";

export default function TodayTodos({ onSectionResolved }) {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const [section, setSection]   = useState(null);   // the "Today" section object
  const [loading, setLoading]   = useState(true);
  const [newTask, setNewTask]   = useState("");
  const [adding, setAdding]     = useState(false);

  // pull todos for this section from redux
  const todos = useSelector(state =>
    section ? (state.todos.todosBySection[section._id] || []) : []
  );

  // ── find the "Today" section then load its todos ──
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getTodoSections();
        const found = res.data.data.find(s =>
          s.title.trim().toLowerCase() === "today"
        );
        if (found) {
          setSection(found);
          if (onSectionResolved) onSectionResolved(found._id);
          const tr = await getSectionTodos(found._id);
          dispatch(setTodos({ sectionId: found._id, todos: tr.data.data }));
        }
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    init();
  }, [dispatch]);

  const handleToggle = async (todo) => {
    try {
      const res = await toggleTodo(todo._id);
      dispatch(updateTodo({ sectionId: section._id, todo: res.data.data }));
    } catch (e) { console.log(e); }
  };

  const handleAdd = async () => {
    if (!newTask.trim() || !section) return;
    try {
      const res = await createTodo({ title: newTask.trim(), section: section._id });
      dispatch(addTodo({ sectionId: section._id, todo: res.data.data }));
      setNewTask("");
    } catch (e) { console.log(e); }
  };

  const done  = todos.filter(t => t.completed).length;
  const total = todos.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Today's To-Do
          </h2>
          {!loading && !section && (
            <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              No "Today" section
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: "var(--border-default)", color: "var(--text-muted)", border: "1px solid rgba(63,63,70,0.5)" }}>
              {done}/{total}
            </span>
          )}
          <button
            onClick={() => navigate("/planner")}
            className="text-[10px] font-semibold transition-colors duration-150"
            style={{ color: "#f97316" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
            onMouseLeave={e => e.currentTarget.style.color = "#f97316"}
          >
            Open planner →
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{ background: "linear-gradient(145deg,var(--bg-card),var(--bg-card-alt))", border: "1px solid rgba(39,39,42,0.9)" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}
      >
        {/* Top accent */}
        <div className="h-[1.5px]"
          style={{ background: "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)" }} />

        {/* Progress bar */}
        {total > 0 && (
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--border-default)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct === 100
                      ? "linear-gradient(90deg,#22c55e,#16a34a)"
                      : "linear-gradient(90deg,#f97316,#ef4444)",
                  }} />
              </div>
              <span className="text-[10px] font-bold tabular-nums shrink-0"
                style={{ color: pct === 100 ? "#22c55e" : "var(--text-faint)" }}>
                {pct}%
              </span>
            </div>
          </div>
        )}

        <div className="p-4 flex flex-col gap-1.5">
          {/* Loading */}
          {loading && (
            <p className="text-xs py-4 text-center" style={{ color: "var(--text-ghost)" }}>Loading…</p>
          )}

          {/* No section found */}
          {!loading && !section && (
            <div className="py-6 flex flex-col items-center gap-2">
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Create a section named <span style={{ color: "#f97316" }}>"Today"</span> in your planner.
              </p>
              <button onClick={() => navigate("/planner")}
                className="px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg,#f97316,#dc2626)" }}>
                Go to Planner
              </button>
            </div>
          )}

          {/* Empty section */}
          {!loading && section && todos.length === 0 && (
            <p className="text-xs py-4 text-center" style={{ color: "var(--text-ghost)" }}>No tasks yet. Add one below.</p>
          )}

          {/* Todo rows */}
          {todos.map(todo => (
            <div
              key={todo._id}
              onClick={() => handleToggle(todo)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group"
              style={{
                background: "transparent",
                border: "1px solid transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Checkbox */}
              <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={todo.completed
                  ? { background: "linear-gradient(135deg,#f97316,#dc2626)", border: "1px solid transparent" }
                  : { background: "transparent", border: "1px solid rgba(63,63,70,0.7)" }
                }>
                {todo.completed && (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 8L8.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <span className="text-xs flex-1 transition-all duration-200"
                style={{
                  color: todo.completed ? "var(--text-ghost)" : "var(--text-primary)",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}>
                {todo.title}
              </span>
            </div>
          ))}

          {/* Add task row */}
          {section && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl mt-1 transition-all duration-200"
              style={{ background: "var(--bg-input)", border: "1px solid rgba(39,39,42,0.8)" }}
              onFocus={() => {}}
            >
              <svg width="9" height="9" viewBox="0 0 11 11" fill="none" style={{ color: "var(--text-ghost)", flexShrink: 0 }}>
                <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="Add a task… (Enter)"
                className="flex-1 bg-transparent text-xs placeholder:text-zinc-700 focus:outline-none"
                style={{ color: "var(--text-secondary)" }}
                onFocus={e => e.currentTarget.closest("div").style.borderColor = "rgba(249,115,22,0.35)"}
                onBlur={e => e.currentTarget.closest("div").style.borderColor = "var(--border-default)"}
              />
              <button
                onClick={handleAdd}
                disabled={!newTask.trim()}
                className="shrink-0 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide uppercase text-white transition-all active:scale-95 disabled:opacity-20"
                style={{ background: "linear-gradient(135deg,#f97316,#dc2626)" }}>
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}