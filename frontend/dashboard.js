// =============================================
//  dashboard.js
// =============================================

const JOINED_KEY = "joinedEvents";

function getJoined() {
  return JSON.parse(localStorage.getItem(JOINED_KEY) || "[]");
}

function saveJoined(arr) {
  localStorage.setItem(JOINED_KEY, JSON.stringify(arr));
}

// ── Build a single event card ──────────────────
function buildCard(event, options = {}) {
  const { showLeave = false, showJoin = false, isPast = false } = options;
  const count = event.participants ? event.participants.length : 0;
  const maxSlots = event.maxParticipants || 20;
  const fillPct = Math.min((count / maxSlots) * 100, 100);
  const joined = getJoined();
  const isJoined = joined.includes(event._id);

  const date = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
      })
    : "TBD";

  const time = event.date
    ? new Date(event.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  const card = document.createElement("div");
  card.className = `event-card${isJoined ? " joined-card" : ""}`;
  if (isPast) card.style.opacity = "0.55";

  card.innerHTML = `
    <div class="event-header">
      <div class="event-title">${event.title || "Untitled Event"}</div>
      <span class="event-badge ${isJoined ? "badge-joined" : "badge-upcoming"}">
        ${isPast ? "Past" : isJoined ? "✓ Joined" : "Open"}
      </span>
    </div>

    <div class="event-meta">
      <div class="meta-row">
        <span class="meta-icon">📅</span>
        <span>${date}${time ? " · " + time : ""}</span>
      </div>
      ${event.location ? `
      <div class="meta-row">
        <span class="meta-icon">📍</span>
        <span>${event.location}</span>
      </div>` : ""}
      ${event.description ? `
      <div class="meta-row">
        <span class="meta-icon">📝</span>
        <span>${event.description}</span>
      </div>` : ""}
    </div>

    <div class="event-participants">
      <div class="participants-bar">
        <div class="participants-fill" style="width:${fillPct}%"></div>
      </div>
      <span class="participants-count">${count} / ${maxSlots}</span>
    </div>

    <div class="event-footer">
      ${showLeave && !isPast
        ? `<button class="btn btn-danger" onclick="leaveEvent('${event._id}', this)">Leave Event</button>`
        : ""}
      ${showJoin && !isJoined && !isPast
        ? `<button class="btn btn-primary" onclick="joinFromDashboard('${event._id}', this)">Join Event</button>`
        : ""}
      ${showJoin && isJoined && !isPast
        ? `<button class="btn btn-joined" disabled>✓ Joined</button>`
        : ""}
      ${isPast
        ? `<span style="font-size:0.8rem;color:var(--text-dim)">This run is done.</span>`
        : ""}
    </div>
  `;

  return card;
}

// ── Render: My Joined Events ───────────────────
function renderMyEvents(events) {
  const container = document.getElementById("my-events-container");
  const now = new Date();

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👟</div>
        <h3>No events joined yet</h3>
        <p>Head to <a href="events.html" style="color:var(--accent)">Events</a> and pick a run!</p>
      </div>`;
    document.getElementById("stat-joined").textContent = 0;
    document.getElementById("stat-upcoming-joined").textContent = 0;
    return;
  }

  const upcoming = events.filter(e => e.date && new Date(e.date) >= now);
  document.getElementById("stat-joined").textContent = events.length;
  document.getElementById("stat-upcoming-joined").textContent = upcoming.length;

  const grid = document.createElement("div");
  grid.className = "events-grid";

  events.forEach((event, i) => {
    const isPast = event.date && new Date(event.date) < now;
    const card = buildCard(event, { showLeave: true, isPast });
    card.style.animationDelay = `${i * 0.06}s`;
    grid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// ── Render: All Upcoming Events ────────────────
function renderAllEvents(events) {
  const container = document.getElementById("all-events-container");
  const now = new Date();
  const upcoming = events.filter(e => !e.date || new Date(e.date) >= now);

  document.getElementById("stat-all-live").textContent = upcoming.length;

  if (upcoming.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗓️</div>
        <h3>No upcoming events</h3>
        <p>Be the first — <a href="events.html" style="color:var(--accent)">create one!</a></p>
      </div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "events-grid";

  upcoming.forEach((event, i) => {
    const card = buildCard(event, { showJoin: true });
    card.style.animationDelay = `${i * 0.06}s`;
    grid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// ── Actions ────────────────────────────────────
async function leaveEvent(eventId, btn) {
  btn.disabled = true;
  btn.textContent = "Leaving…";
  try {
    await api.leaveEvent(eventId);
    const joined = getJoined().filter(id => id !== eventId);
    saveJoined(joined);
    showToast("Left the event.", "info");
    loadDashboard();
  } catch {
    showToast("Couldn't leave. Try again.", "error");
    btn.disabled = false;
    btn.textContent = "Leave Event";
  }
}

async function joinFromDashboard(eventId, btn) {
  btn.disabled = true;
  btn.textContent = "Joining…";
  try {
    await api.joinEvent(eventId);
    const joined = getJoined();
    if (!joined.includes(eventId)) { joined.push(eventId); saveJoined(joined); }
    showToast("You're in! 🏃", "success");
    loadDashboard();
  } catch {
    showToast("Couldn't join. Try again.", "error");
    btn.disabled = false;
    btn.textContent = "Join Event";
  }
}

// ── Load everything ────────────────────────────
async function loadDashboard() {
  // Reset containers to loading state
  ["my-events-container", "all-events-container"].forEach(id => {
    document.getElementById(id).innerHTML =
      `<div class="loading"><div class="spinner"></div> Loading…</div>`;
  });

  try {
    // Fetch all events in one call
    const allEvents = await api.getEvents();

    // My events: filter by joinedEvents in localStorage
    // (swap with api.getMyEvents() once real auth is done)
    const joined = getJoined();
    const myEvents = allEvents.filter(e => joined.includes(e._id));

    renderMyEvents(myEvents);
    renderAllEvents(allEvents);
  } catch (err) {
    ["my-events-container", "all-events-container"].forEach(id => {
      document.getElementById(id).innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Couldn't load events</h3>
          <p>Make sure the backend is running on port 5000.</p>
        </div>`;
    });
    document.getElementById("stat-joined").textContent = "—";
    document.getElementById("stat-upcoming-joined").textContent = "—";
    document.getElementById("stat-all-live").textContent = "—";
  }
}

// ── Toast ──────────────────────────────────────
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Init ───────────────────────────────────────
loadDashboard();
