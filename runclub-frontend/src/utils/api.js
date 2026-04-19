import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const client = axios.create({
  baseURL: API_URL
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("runclub_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const register = (payload) => client.post("/register", payload);
export const login = (payload) => client.post("/login", payload);
export const getEvents = () => client.get("/events");
export const getMyEvents = () => client.get("/my-events");
export const getMyCreatedEvents = () => client.get("/my-created-events");
export const createEvent = (payload) => client.post("/create-event", payload);
export const joinEvent = (id) => client.post(`/join-event/${id}`);
export const leaveEvent = (id) => client.post(`/leave-event/${id}`);
export const updateEvent = (id, payload) => client.put(`/events/${id}`, payload);
export const deleteEvent = (id) => client.delete(`/events/${id}`);
export const getChatMessages = (eventId) => client.get(`/chat/${eventId}`);
export const sendChatMessage = (eventId, payload) => client.post(`/chat/${eventId}`, payload);
export const getLeaderboard = () => client.get("/leaderboard");
export const getNotifications = () => client.get("/notifications");
export const markNotificationAsRead = (id) => client.post(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => client.post("/notifications/read-all");

export { API_URL };
