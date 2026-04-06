import { api } from "./index.js";

// ── Daily ──────────────────────────────────────────────────────────────────
export const postDailyCheckIn = () =>
  api.post("/checkin/daily");

export const fetchDailyCheckInStatus = () =>
  api.get("/checkin/daily/status");


// ── Habit ──────────────────────────────────────────────────────────────────
export const postHabitCheckIn = (habitId) =>
  api.post(`/checkin/habit/${habitId}`);

export const fetchTodayHabitStatuses = () =>
  api.get("/checkin/habit/today");


// ── Goal ───────────────────────────────────────────────────────────────────
export const postGoalCheckIn = (goalId, proofUrl) =>
  api.post(`/checkin/goal/${goalId}`, { proofUrl });


// ── History ────────────────────────────────────────────────────────────────
export const fetchCheckInHistory = (entityType, entityId, days = 105) =>
  api.get("/checkin/history", {
    params: { entityType, entityId, days }
  });