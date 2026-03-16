import { api } from "./index.js";

export const createCircle = (data) => api.post("/circle/create", data);
export const getUserCircles = () => api.get("/circle/get-user-circles");
export const getCircleById = (circleId) => api.get(`/circle/${circleId}`);
export const joinCircle = (data) => api.post("/circle/join", data);
export const leaveCircle = (circleId) => api.patch(`/circle/leave/${circleId}`);
export const deleteCircle = (circleId) => api.delete(`/circle/delete/${circleId}`);

