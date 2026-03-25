// =============================================
//  events.js  —  Events Page Logic
// =============================================

// We track joined events in localStorage so the UI
// persists across refreshes (until real auth is wired up).
const JOINED_KEY = "joinedEvents";

function getJoined() {
  return JSON.parse(localStorage.getItem(JOINED_KEY) || "[]");
}

function saveJoined(arr) {
  localStorage.setItem(JOINED_KEY, JSON.stringify(arr));
}

// ── Render events ──────────────────────────────
function renderEvents(events) {
  const container = document.getElementById("events-container");
  const joined = getJoined();

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🏃</div>
        <h3>No events yet</h3>
        <p>Check back soon — something's being planned.</p>
      </div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "events-grid";

  events.forEach((event, i) => {
    const isJoined = joined.includes(event._id);
    const count = event.participants ? event.participants.length : 0;
    const maxSlots = event.maxParticipants || 20;
    const fillPct = Math.min((count / maxSlots) * 100, 100);

    const date = event.date
      ? new Date(event.date).toLocaleDateString("en-IN", {
          weekday: "short", day: "numeric", month: "short", year: "numeric"
        })
      : "TBD";

    const card = document.createElement("div");
    card.className = `event-card${isJoined ? " joined-card" : ""}`;
    card.style.animationDelay = `${i * 0.06}s`;

    card.innerHTML = `
      <div class="event-header">
        <div class="event-title">${event.title || "Untitled Event"}</div>
        <span class="event-badge ${isJoined ? "badge-joined" : "badge-upcoming"}">
          ${isJoined ? "✓ Joined" : "Open"}
        </span>
      </div>

      <div class="event-meta">
        <div class="meta-row">
          <span class="meta-icon">📅</span>
          <span>${date}</span>
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
          <div class="participants-fill" style="width: ${fillPct}%"></div>
        </div>
        <span class="participants-count">${count} joined</span>
      </div>

      <div class="event-footer">
        ${isJoined
          ? `<button class="btn btn-danger" onclick="leaveEvent('${event._id}', this)">
               Leave Event
             </button>`
          : `<button class="btn btn-primary" onclick="joinEvent('${event._id}', this)">
               Join Event
             </button>`
        }
      </div>
    `;

    grid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// ── Join event ─────────────────────────────────
async function joinEvent(eventId, btn) {
  btn.disabled = true;
  btn.textContent = "Joining…";

  try {
    await api.joinEvent(eventId);

    const joined = getJoined();
    if (!joined.includes(eventId)) {
      joined.push(eventId);
      saveJoined(joined);
    }

    showToast("You're in! See you at the run 🏃", "success");
    loadEvents(); // refresh list
  } catch (err) {
    showToast("Couldn't join. Try again.", "error");
    btn.disabled = false;
    btn.textContent = "Join Event";
  }
}

// ── Leave event ────────────────────────────────
async function leaveEvent(eventId, btn) {
  btn.disabled = true;
  btn.textContent = "Leaving…";

  try {
    await api.leaveEvent(eventId);

    const joined = getJoined().filter(id => id !== eventId);
    saveJoined(joined);

    showToast("You've left the event.", "info");
    loadEvents();
  } catch (err) {
    showToast("Couldn't leave. Try again.", "error");
    btn.disabled = false;
    btn.textContent = "Leave Event";
  }
}

// ── Load events from backend ───────────────────
async function loadEvents() {
  const container = document.getElementById("events-container");
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      Loading events…
    </div>`;

  try {
    const events = await api.getEvents();
    renderEvents(events);
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Couldn't load events</h3>
        <p>Make sure the backend is running on port 5000.</p>
      </div>`;
  }
}

// ── Toast helper ───────────────────────────────
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
loadEvents();
