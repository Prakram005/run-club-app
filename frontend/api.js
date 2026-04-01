const LOCAL_API_BASE_URL = "http://localhost:5000";
const REMOTE_API_BASE_URL = "https://run-club-app.onrender.com";
const isLocalPage =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const DEFAULT_API_BASE_URL = isLocalPage ? LOCAL_API_BASE_URL : REMOTE_API_BASE_URL;
const API_BASE_URL =
  window.API_BASE_URL ||
  localStorage.getItem("apiBaseUrl") ||
  DEFAULT_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };

  let res;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Cannot reach the API at ${API_BASE_URL}. Check the backend URL, CORS settings, and that the Render service is awake.`
    );
  }

  const raw = await res.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { message: raw };
    }
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

// ✅ MAKE IT GLOBAL
window.api = {
  register: (data) =>
    request("/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data) =>
    request("/login", { method: "POST", body: JSON.stringify(data) }),

  getEvents: () => request("/events"),

  createEvent: (data) =>
    request("/create-event", { method: "POST", body: JSON.stringify(data) }),

  joinEvent: (id) =>
    request(`/join-event/${id}`, { method: "POST" }),

  leaveEvent: (id) =>
    request(`/leave-event/${id}`, { method: "POST" }),

  getMyEvents: () => request("/my-events"),
};
