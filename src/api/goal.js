import { api } from "./index.js";

// ── CRUD ─────────────────────────────
export const createGoal = (data) =>
  api.post("/goals", data);

export const getMyGoals = () =>
  api.get("/goals");

export const getGoalById = (goalId) =>
  api.get(`/goals/${goalId}`);

export const updateGoal = (goalId, data) =>
  api.patch(`/goals/${goalId}`, data);

export const deleteGoal = (goalId) =>
  api.delete(`/goals/${goalId}`);


// ── GOAL ACTIONS ─────────────────────
export const markGoalComplete = (goalId, data) =>
  api.post(`/goals/${goalId}/complete`, data);

export const verifyProof = (goalId, requestId, action) =>
  api.post(`/goals/${goalId}/verify/${requestId}`, { action });


// ── JOIN / LEAVE ─────────────────────
export const joinGoal = (goalId) =>
  api.post(`/goals/${goalId}/join`);

export const leaveGoal = (goalId) =>
  api.post(`/goals/${goalId}/leave`);


// ── CIRCLE ───────────────────────────
export const getCircleGoals = (circleId) =>
  api.get(`/goals/circle/${circleId}`);


// ── LEADERBOARD ──────────────────────
export const getGoalLeaderboard = (goalId) =>
  api.get(`/goals/${goalId}/leaderboard`);