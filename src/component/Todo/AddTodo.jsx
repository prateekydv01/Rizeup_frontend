import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../../api/todo.js";
import { addTodo } from "../../store/todo.slice";

function AddTodo({ sectionId }) {

  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleAdd = async () => {
    if (!title.trim()) return;
    const res = await createTodo({ title, section: sectionId });
    dispatch(addTodo({ sectionId, todo: res.data.data }));
    setTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-200"
      style={{ background: "rgba(24,24,27,0.5)", border: "1px solid rgba(39,39,42,0.8)" }}
    >
      <svg width="9" height="9" viewBox="0 0 11 11" fill="none" className="shrink-0" style={{ color: "#3f3f46" }}>
        <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a task..."
        className="flex-1 bg-transparent text-xs placeholder:text-zinc-700 focus:outline-none min-w-0"
        style={{ color: "#a1a1aa" }}
        onFocus={e => e.currentTarget.closest("div").style.borderColor = "rgba(249,115,22,0.35)"}
        onBlur={e => e.currentTarget.closest("div").style.borderColor = "rgba(39,39,42,0.8)"}
      />

      <button
        onClick={handleAdd}
        disabled={!title.trim()}
        className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase text-white transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-85 active:scale-95"
        style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
      >
        Add
      </button>
    </div>
  );
}

export default AddTodo;