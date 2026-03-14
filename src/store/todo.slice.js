import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todosBySection: {},
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      const { sectionId, todos } = action.payload;
      state.todosBySection[sectionId] = todos;
    },

    addTodo: (state, action) => {
      const { sectionId, todo } = action.payload;

      if (!state.todosBySection[sectionId]) {
        state.todosBySection[sectionId] = [];
      }

      state.todosBySection[sectionId].push(todo);
    },

    updateTodo: (state, action) => {
      const { sectionId, todo } = action.payload;

      const todos = state.todosBySection[sectionId];

      const index = todos.findIndex((t) => t._id === todo._id);

      if (index !== -1) {
        todos[index] = todo;
      }
    },

    removeTodo: (state, action) => {
      const { sectionId, todoId } = action.payload;

      state.todosBySection[sectionId] =
        state.todosBySection[sectionId].filter(
          (todo) => todo._id !== todoId
        );
    },
  },
});

export const {
  setTodos,
  addTodo,
  updateTodo,
  removeTodo,
} = todoSlice.actions;

export default todoSlice.reducer;