import axios from "axios";

const BASE = "/api/v1/checkin";

// ── Daily ──────────────────────────────────────────────────────────────────
export const postDailyCheckIn       = () => axios.post(`${BASE}/daily`);
export const fetchDailyCheckInStatus = () => axios.get(`${BASE}/daily/status`);

// ── Habit ──────────────────────────────────────────────────────────────────
export const postHabitCheckIn        = (habitId) => axios.post(`${BASE}/habit/${habitId}`);
export const fetchTodayHabitStatuses = () => axios.get(`${BASE}/habit/today`);

// ── Goal ───────────────────────────────────────────────────────────────────
export const postGoalCheckIn = (goalId, proofUrl) =>
  axios.post(`${BASE}/goal/${goalId}`, { proofUrl });

// ── History (contribution graph) ───────────────────────────────────────────
export const fetchCheckInHistory = (entityType, entityId, days = 105) =>
  axios.get(`${BASE}/history`, { params: { entityType, entityId, days } });