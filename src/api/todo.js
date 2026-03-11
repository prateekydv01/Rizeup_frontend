import { api } from "./index.js";

// create todo
export const createToDo = (data) => api.post("/todo/create", data);

// get all todos
export const getAllTodos = () => api.get("/todo/get-all-todo");

// get todos by type (personal, work etc)
export const getTodosByType = (type) => api.get(`/todo/type/${type}`);

// update todo
export const updateTodo = (todoId, data) =>
  api.patch(`/todo/update/${todoId}`, data);

// toggle todo (complete / incomplete)
export const toggleTodo = (todoId) =>
  api.patch(`/todo/toggle/${todoId}`);

// delete todo
export const deleteTodo = (todoId) =>
  api.delete(`/todo/delete/${todoId}`);