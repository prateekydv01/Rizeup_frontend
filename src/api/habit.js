import { api } from "./index.js";

export const createHabit          = (data)          => api.post("/habits/create", data);
export const getMyHabits          = ()               => api.get("/habits/my-habits");
export const getHabitById         = (habitId)        => api.get(`/habits/${habitId}`);
export const updateHabit          = (habitId, data)  => api.patch(`/habits/update/${habitId}`, data);
export const deleteHabit          = (habitId)        => api.delete(`/habits/delete/${habitId}`);
export const joinHabit            = (habitId)        => api.post(`/habits/join/${habitId}`);
export const leaveHabit           = (habitId)        => api.patch(`/habits/leave/${habitId}`);
export const getCircleHabits      = (circleId)       => api.get(`/habits/circle/${circleId}`);
export const checkInHabit         = (habitId)        => api.post(`/habits/checkin/${habitId}`);
export const getMyHabitGraph      = (habitId, year)  => api.get(`/habits/graph/${habitId}`, { params: { year } });
export const getMembersGraph      = (habitId, year)  => api.get(`/habits/members-graph/${habitId}`, { params: { year } });
export const linkHabitToCircle    = (habitId, data)  => api.patch(`/habits/link-circle/${habitId}`, data);
export const unlinkHabitFromCircle= (habitId)        => api.patch(`/habits/unlink-circle/${habitId}`);