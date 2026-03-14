import { api } from "./index.js";

export const createTodo = (data) =>
  api.post("/todos/create", data);

export const getSectionTodos = (sectionId) =>
  api.get(`/todos/section/${sectionId}`);

export const updateTodo = (todoId, data) =>
  api.patch(`/todos/update/${todoId}`, data);

export const toggleTodo = (todoId) =>
  api.patch(`/todos/toggle/${todoId}`);

export const deleteTodo = (todoId) =>
  api.delete(`/todos/delete/${todoId}`);