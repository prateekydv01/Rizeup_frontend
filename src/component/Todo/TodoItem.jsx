import { useDispatch } from "react-redux";
import { toggleTodo, deleteTodo } from "../../api/todo.js";
import { removeTodo, updateTodo } from "../../store/todo.slice.js";

function TodoItem({ todo, sectionId }) {

  const dispatch = useDispatch();

  const handleToggle = async () => {
    const res = await toggleTodo(todo._id);
    dispatch(updateTodo({ sectionId, todo: res.data.data }));
  };

  const handleDelete = async () => {
    await deleteTodo(todo._id);
    dispatch(removeTodo({ sectionId, todoId: todo._id }));
  };

  return (
    <div
      className="flex items-start gap-2 rounded-lg px-2.5 py-2 transition-all duration-200 group/item"
      style={{
        background: todo.completed ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${todo.completed ? "rgba(39,39,42,0.5)" : "rgba(39,39,42,0.8)"}`,
      }}
      onMouseEnter={e => { if (!todo.completed) e.currentTarget.style.borderColor = "rgba(63,63,70,0.8)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = todo.completed ? "rgba(39,39,42,0.5)" : "rgba(39,39,42,0.8)"; }}
    >

      {/* Checkbox */}
      <div
        onClick={handleToggle}
        className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: todo.completed ? "linear-gradient(135deg, #f97316, #ef4444)" : "transparent",
          border: todo.completed ? "1px solid transparent" : "1px solid rgba(82,82,91,0.7)",
        }}
      >
        {todo.completed && (
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M1 4L3 6.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Title */}
      <p
        className="flex-1 text-xs leading-relaxed min-w-0 transition-all duration-200"
        style={{
          color: todo.completed ? "#3f3f46" : "#a1a1aa",
          textDecoration: todo.completed ? "line-through" : "none",
          wordBreak: "break-word",
        }}
      >
        {todo.title}
      </p>

      {/* Delete */}
      <button
        onClick={handleDelete}
        title="Delete"
        className="shrink-0 mt-0.5 opacity-0 group-hover/item:opacity-100 w-4 h-4 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-red-500/15 active:scale-90"
        style={{ color: "#52525b" }}
        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
        onMouseLeave={e => e.currentTarget.style.color = "#52525b"}
      >
        <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

    </div>
  );
}

export default TodoItem;