import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSectionTodos } from "../../api/todo";
import { setTodos } from "../../store/todo.slice";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import TodoSectionHeader from "./TodoSectionHeader";

function TodoSection({ section }) {

  const dispatch = useDispatch();

  const todos =
    useSelector(state => state.todos.todosBySection[section._id]) || [];

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await getSectionTodos(section._id);
      dispatch(setTodos({ sectionId: section._id, todos: res.data.data }));
    };
    fetchTodos();
  }, [section._id, dispatch]);

  return (
    <div
      className="rounded-xl flex flex-col transition-all duration-300 group/card"
      style={{
        background: "linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-alt) 100%)",
        border: "1px solid rgba(39,39,42,0.9)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}
    >

      {/* Top accent stripe */}
      <div className="h-[1.5px] w-full rounded-t-xl shrink-0"
        style={{ background: "linear-gradient(90deg, #f97316 0%, #ef4444 40%, transparent 100%)" }} />

      {/* Header */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <TodoSectionHeader section={section} />
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="px-3 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--border-default)" }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: progressPct === 100 ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #f97316, #ef4444)",
                }}
              />
            </div>
            <span className="text-[10px] tabular-nums shrink-0 font-bold" style={{ color: progressPct === 100 ? "#22c55e" : "var(--text-faint)" }}>
              {progressPct}%
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-3 mb-2 h-px" style={{ background: "var(--border-subtle)" }} />

      {/* Todo list */}
      <div className="px-3 flex flex-col gap-1">
        {todos.length === 0 && (
          <div className="flex items-center gap-2 py-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "var(--border-subtle)", border: "1px solid rgba(63,63,70,0.4)" }}>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M6 2.5v5M3.5 5.5l2.5 2 2.5-2" stroke="var(--text-faint)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[10px] tracking-wide font-medium" style={{ color: "var(--text-ghost)" }}>No tasks yet</p>
          </div>
        )}
        {todos.map(todo => (
          <TodoItem key={todo._id} todo={todo} sectionId={section._id} />
        ))}
      </div>

      {/* Add todo */}
      <div className="px-3 py-3 shrink-0">
        <AddTodo sectionId={section._id} />
      </div>

    </div>
  );
}

export default TodoSection;