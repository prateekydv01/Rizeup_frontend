import { api } from "./index.js";

// ── Google Connection ─────────────────────────────────────────────
export const fetchGoogleStatus = () =>
  api.get("/google/status");

export const fetchGoogleAuthUrl = () =>
  api.get("/google/auth-url");

export const disconnectGoogle = () =>
  api.post("/google/disconnect");


// ── Calendar Events ───────────────────────────────────────────────
export const fetchCalendarEvents = (timeMin, timeMax) =>
  api.get("/google/events", {
    params: { timeMin, timeMax }
  });

export const createCalendarEvent = (data) =>
  api.post("/google/events", data);

export const updateCalendarEvent = (eventId, data) =>
  api.patch(`/google/events/${eventId}`, data);

export const deleteCalendarEvent = (eventId) =>
  api.delete(`/google/events/${eventId}`);