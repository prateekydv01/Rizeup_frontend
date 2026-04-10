import { api } from "./index.js";

console.log(api);
export const loginUser = (data) => api.post("/v1/user/login", data);
export const registerUser = (data) => api.post("/v1/user/register", data);
export const logoutUser = () => api.post("/v1/user/logout");
export const getCurrentUser = () => api.get("/v1/user/current-user");