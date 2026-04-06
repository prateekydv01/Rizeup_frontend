import axios from "axios";

const BASE = "https://rizeupbackend.onrender.com/api/v1/google/auth-url";

export const fetchGoogleStatus    = () => axios.get(`${BASE}/status`);
export const fetchGoogleAuthUrl   = () => axios.get(`${BASE}/auth-url`);
export const disconnectGoogle     = () => axios.post(`${BASE}/disconnect`);

export const fetchCalendarEvents  = (timeMin, timeMax) =>
  axios.get(`${BASE}/events`, { params: { timeMin, timeMax } });

export const createCalendarEvent  = (data) => axios.post(`${BASE}/events`, data);
export const updateCalendarEvent  = (eventId, data) => axios.patch(`${BASE}/events/${eventId}`, data);
export const deleteCalendarEvent  = (eventId) => axios.delete(`${BASE}/events/${eventId}`);