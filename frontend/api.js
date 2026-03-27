const BASE_URL = "https://run-club-app.onrender.com";

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

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

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