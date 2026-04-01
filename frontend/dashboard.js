// =============================================
//  dashboard.js  (Upgraded)
// =============================================

const JOINED_KEY = "joinedEvents";

function getJoined()     { return JSON.parse(localStorage.getItem(JOINED_KEY) || "[]"); }
function saveJoined(arr) { localStorage.setItem(JOINED_KEY, JSON.stringify(arr)); }
function getCurrentUserId() {
  return (JSON.parse(localStorage.getItem("user") || "{}")).id || null;
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function fmtDate(iso) {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday:"short", day:"numeric", month:"short", year:"numeric"
  });
}
function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
}

// ── Build card ───────────────────────────────────
function buildCard(event, opts = {}) {
  const { showLeave = false, showJoin = false, isPast = false } = opts;

  const joined   = getJoined();
  const isJoined = joined.includes(event._id);
  const count    = event.participants?.length ?? 0;
  const maxSlots = event.maxParticipants || 20;
  const fillPct  = Math.min((count / maxSlots) * 100, 100);

  let badge = "Open", badgeCls = "badge-upcoming";
  if (isPast)        { badge = "Past";     badgeCls = "badge-past"; }
  else if (isJoined) { badge = "✓ Joined"; badgeCls = "badge-joined"; }

  const card = document.createElement("div");
  card.className = `event-card${isJoined ? " joined-card" : ""}`;
  if (isPast) card.style.opacity = "0.55";

  card.innerHTML = `
    <div class="event-header">
      <div class="event-title">${esc(event.title) || "Untitled Event"}</div>
      <span class="event-badge ${badgeCls}">${badge}</span>
    </div>

    <div class="event-meta">
      <div class="meta-row">
        <span class="meta-icon">📅</span>
        <span>${fmtDate(event.date)}${event.date ? " · " + fmtTime(event.date) : ""}</span>
      </div>
      ${event.location ? `
      <div class="meta-row">
        <span class="meta-icon">📍</span>
        <span>${esc(event.location)}</span>
      </div>` : ""}
      ${event.description ? `
      <div class="meta-row">
        <span class="meta-icon">📝</span>
        <span style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
          ${esc(event.description)}
        </span>
      </div>` : ""}
    </div>

    <div class="event-participants">
      <div class="participants-bar">
        <div class="participants-fill" style="width:${fillPct}%"></div>
      </div>
      <span class="participants-count">${count} / ${maxSlots}</span>
    </div>

    <div class="event-footer">
      ${showLeave && isJoined && !isPast
        ? `<button class="btn btn-danger btn-sm" onclick="leaveEvent('${event._id}',this)">Leave Event</button>`
        : ""}
      ${showJoin && !isJoined && !isPast
        ? `<button class="btn btn-primary btn-sm" onclick="joinFromDashboard('${event._id}',this)">Join Event</button>`
        : ""}
      ${showJoin && isJoined && !isPast
        ? `<button class="btn btn-joined btn-sm" disabled>✓ Joined</button>`
        : ""}
      ${isPast
        ? `<span style="font-size:0.78rem;color:var(--text-dim)">This run is done.</span>`
        : ""}
    </div>
  `;

  return card;
}

// ── Render: My Joined Events ─────────────────────
function renderMyEvents(events) {
  const container = document.getElementById("my-events-container");
  const now = new Date();

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👟</div>
        <h3>No Events Joined Yet</h3>
        <p>Head to <a href="events.html">Events</a> and pick a run!</p>
      </div>`;
    document.getElementById("stat-joined").textContent         = "0";
    document.getElementById("stat-upcoming-joined").textContent = "0";
    return;
  }

  const upcoming = events.filter(e => e.date && new Date(e.date) >= now);
  document.getElementById("stat-joined").textContent         = events.length;
  document.getElementById("stat-upcoming-joined").textContent = upcoming.length;

  const grid = document.createElement("div");
  grid.className = "events-grid";

  events.forEach((event, i) => {
    const isPast = event.date && new Date(event.date) < now;
    const card   = buildCard(event, { showLeave: true, isPast });
    card.style.animationDelay = `${i * 0.055}s`;
    grid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// ── Render: All Upcoming Events ──────────────────
function renderAllEvents(events) {
  const container = document.getElementById("all-events-container");
  const now = new Date();
  const upcoming = events.filter(e => !e.date || new Date(e.date) >= now);

  document.getElementById("stat-all-live").textContent = upcoming.length;

  if (upcoming.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗓️</div>
        <h3>No Upcoming Events</h3>
        <p>Be the first — <a href="events.html">create one!</a></p>
      </div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "events-grid";

  upcoming.forEach((event, i) => {
    const card = buildCard(event, { showJoin: true });
    card.style.animationDelay = `${i * 0.055}s`;
    grid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// ── Actions ──────────────────────────────────────
async function leaveEvent(id, btn) {
  btn.disabled = true; btn.textContent = "Leaving…";
  try {
    await api.leaveEvent(id);
    saveJoined(getJoined().filter(x => x !== id));
    showToast("Left the event.", "info");
    loadDashboard();
  } catch {
    showToast("Couldn't leave. Try again.", "error");
    btn.disabled = false; btn.textContent = "Leave Event";
  }
}

async function joinFromDashboard(id, btn) {
  btn.disabled = true; btn.textContent = "Joining…";
  try {
    await api.joinEvent(id);
    const j = getJoined();
    if (!j.includes(id)) { j.push(id); saveJoined(j); }
    showToast("You're in! 🏃", "success");
    loadDashboard();
  } catch {
    showToast("Couldn't join. Try again.", "error");
    btn.disabled = false; btn.textContent = "Join Event";
  }
}

// ── Load ─────────────────────────────────────────
async function loadDashboard() {
  ["my-events-container","all-events-container"].forEach(id => {
    document.getElementById(id).innerHTML =
      `<div class="loading"><div class="spinner"></div> Loading…</div>`;
  });

  try {
    const allEvents = await api.getEvents();
    const joined    = getJoined();
    const myEvents  = allEvents.filter(e => joined.includes(e._id));

    renderMyEvents(myEvents);
    renderAllEvents(allEvents);
  } catch {
    ["my-events-container","all-events-container"].forEach(id => {
      document.getElementById(id).innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Couldn't Load Events</h3>
          <p>Check your connection or make sure the backend is running.</p>
        </div>`;
    });
    ["stat-joined","stat-upcoming-joined","stat-all-live"]
      .forEach(id => { document.getElementById(id).textContent = "—"; });
  }
}

// ── Toast ─────────────────────────────────────────
function showToast(message, type = "info") {
  const c = document.getElementById("toast-container");
  const icons = { success:"✓", error:"✕", info:"ℹ" };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span> ${message}`;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ── Init ──────────────────────────────────────────
loadDashboard();
