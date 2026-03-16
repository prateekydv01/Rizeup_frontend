import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTodoSection, deleteTodoSection } from "../../api/todoSection";
import { updateSection, removeSection } from "../../store/todoSection.slice";

function TodoSectionHeader({ section }) {

  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(section.title);

  const handleUpdate = async () => {
    const res = await updateTodoSection(section._id, { title });
    dispatch(updateSection(res.data.data));
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteTodoSection(section._id);
    dispatch(removeSection(section._id));
  };

  return (
    <div className="flex items-center justify-between gap-2 mb-1.5 group/header">

      {editing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); if (e.key === "Escape") setEditing(false); }}
          autoFocus
          className="flex-1 px-2 py-1 rounded-lg text-xs text-zinc-100 focus:outline-none transition min-w-0"
          style={{ fontFamily: "'Syne', sans-serif", background: "var(--bg-input)", border: "1px solid rgba(249,115,22,0.4)" }}
        />
      ) : (
        <h2
          className="truncate flex-1 font-bold"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)" }}
        >
          {section.title}
        </h2>
      )}

      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/header:opacity-100 transition-opacity duration-200">
        {editing ? (
          <button
            onClick={handleUpdate}
            title="Save"
            className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 active:scale-90"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L4 8L8.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-orange-500/10 active:scale-90"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
          >
            <svg width="9" height="9" viewBox="0 0 11 11" fill="none">
              <path d="M7.5 1.5a1.1 1.1 0 0 1 1.55 1.55L3.2 8.9H1.5V7.2L7.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <div className="w-px h-2.5 mx-0.5" style={{ background: "var(--border-subtle)" }} />

        <button
          onClick={handleDelete}
          title="Delete"
          className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-red-500/10 active:scale-90"
          style={{ color: "var(--text-faint)" }}
          onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
        >
          <svg width="9" height="9" viewBox="0 0 11 11" fill="none">
            <path d="M1.5 3h8M4 3V1.5h3V3M9 3l-.55 6H2.55L2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  );
}

export default TodoSectionHeader;