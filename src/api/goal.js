import { api } from "./index.js";

export const createGoal      = (data)                    => api.post("/goals", data);
export const getMyGoals      = ()                        => api.get("/goals");
export const getGoalById     = (goalId)                  => api.get(`/goals/${goalId}`);
export const updateGoal      = (goalId, data)            => api.patch(`/goals/${goalId}`, data);
export const deleteGoal      = (goalId)                  => api.delete(`/goals/${goalId}`);
export const markGoalComplete = (goalId, data)           => api.post(`/goals/${goalId}/complete`, data);
export const verifyProof     = (goalId, requestId, action) => api.post(`/goals/${goalId}/verify/${requestId}`, { action });