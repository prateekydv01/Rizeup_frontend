import { api } from "./index.js";

export const createGoal        = (data)                      => api.post("/goals", data);
export const getMyGoals        = ()                          => api.get("/goals");
export const getGoalById       = (goalId)                    => api.get(`/goals/${goalId}`);
export const updateGoal        = (goalId, data)              => api.patch(`/goals/${goalId}`, data);
export const deleteGoal        = (goalId)                    => api.delete(`/goals/${goalId}`);
export const markGoalComplete  = (goalId, data)              => api.post(`/goals/${goalId}/complete`, data);
export const verifyProof       = (goalId, requestId, action) => api.post(`/goals/${goalId}/verify/${requestId}`, { action });
export const joinGoal          = (goalId)                    => api.post(`/goals/${goalId}/join`);
export const leaveGoal         = (goalId)                    => api.post(`/goals/${goalId}/leave`);
export const getCircleGoals    = (circleId)                  => api.get(`/goals/circle/${circleId}`);
export const getGoalLeaderboard= (goalId)                    => api.get(`/goals/${goalId}/leaderboard`);
export const addDailyLog       = (goalId, data)              => api.post(`/goals/${goalId}/logs`, data);
export const getGoalLogs       = (goalId)                    => api.get(`/goals/${goalId}/logs`);