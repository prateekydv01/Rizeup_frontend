import { api } from "./index.js";

export const createTodoSection = (data) =>
  api.post("/todo-sections/create", data);

export const getTodoSections = () =>
  api.get("/todo-sections/get-sections");

export const updateTodoSection = (sectionId, data) =>
  api.patch(`/todo-sections/update/${sectionId}`, data);

export const deleteTodoSection = (sectionId) =>
  api.delete(`/todo-sections/delete/${sectionId}`);