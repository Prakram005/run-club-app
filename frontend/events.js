// =============================================
//  events.js  —  Events Page Logic  (Upgraded)
// =============================================

const JOINED_KEY = "joinedEvents";
let allEventsCache = [];   // cache for search/sort without re-fetching

function getJoined()    { return JSON.parse(localStorage.getItem(JOINED_KEY) || "[]"); }
function saveJoined(arr){ localStorage.setItem(JOINED_KEY, JSON.stringify(arr)); }
function getCurrentUserId() {
  return (JSON.parse(localStorage.getItem("user") || "{}")).id || null;
}

/* XSS-safe string */
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

// ── Render ──────────────────────────────────────
function renderEvents(events) {
  const container  = document.getElementById("events-container");
  const joined     = getJoined();
  const myId       = getCurrentUserId();
  const searchVal  = (document.getElementById("search-input")?.value || "").toLowerCase();
  const sortVal    = document.getElementById("sort-select")?.value || "asc";

  /* filter */
  let list = events.filter(e =>
    !searchVal ||
    (e.title    && e.title.toLowerCase().includes(searchVal)) ||
    (e.location && e.location.toLowerCase().includes(searchVal))
  );

  /* sort by date */
  list.sort((a, b) => {
    const da = new Date(a.date), db = new Date(b.date);
    return sortVal === "asc" ? da - db : db - da;
  });

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🏃</div>
        <h3>${events.length === 0 ? "No events yet" : "Nothing matches"}</h3>
        <p>${events.length === 0
          ? 'Be the first — <a href="#" onclick="openCreateModal();return false;">create an event</a>!'
          : "Try a different search term."}</p>
      </div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "events-grid";

  list.forEach((event, i) => {
    const isJoined = joined.includes(event._id);
    const isOwner  = myId && String(event.createdBy) === String(myId);
    const isPast   = event.date && new Date(event.date) < new Date();
    const count    = event.participants?.length ?? 0;
    const maxSlots = event.maxParticipants || 20;
    const fillPct  = Math.min((count / maxSlots) * 100, 100);

    /* badge */
    let badge = "Open", badgeCls = "badge-upcoming";
    if (isPast)       { badge = "Past";     badgeCls = "badge-past"; }
    else if (isOwner) { badge = "⚡ Mine";   badgeCls = "badge-mine"; }
    else if (isJoined){ badge = "✓ Joined"; badgeCls = "badge-joined"; }

    const card = document.createElement("div");
    card.className = `event-card${isJoined ? " joined-card" : ""}`;
    card.style.animationDelay = `${i * 0.055}s`;
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
      </div>

      ${event.description
        ? `<p class="event-description-text">${esc(event.description)}</p>`
        : ""}

      <div class="event-participants">
        <div class="participants-bar">
          <div class="participants-fill" style="width:${fillPct}%"></div>
        </div>
        <span class="participants-count">${count} / ${maxSlots}</span>
      </div>

      <div class="event-footer">
        ${isPast
          ? `<span style="font-size:0.78rem;color:var(--text-dim)">This run is done.</span>`
          : isJoined
            ? `<button class="btn btn-danger btn-sm" onclick="leaveEvent('${event._id}',this)">Leave</button>`
            : `<button class="btn btn-primary btn-sm" onclick="joinEvent('${event._id}',this)">Join Event</button>`
        }
      </div>
    `;

    grid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(grid);
}

// ── Join ────────────────────────────────────────
async function joinEvent(id, btn) {
  btn.disabled = true; btn.textContent = "Joining…";
  try {
    await api.joinEvent(id);
    const j = getJoined();
    if (!j.includes(id)) { j.push(id); saveJoined(j); }
    showToast("You're in! See you at the run 🏃", "success");
    loadEvents();
  } catch (err) {
    showToast(err.message || "Couldn't join. Try again.", "error");
    btn.disabled = false; btn.textContent = "Join Event";
  }
}

// ── Leave ───────────────────────────────────────
async function leaveEvent(id, btn) {
  btn.disabled = true; btn.textContent = "Leaving…";
  try {
    await api.leaveEvent(id);
    saveJoined(getJoined().filter(x => x !== id));
    showToast("You've left the event.", "info");
    loadEvents();
  } catch (err) {
    showToast("Couldn't leave. Try again.", "error");
    btn.disabled = false; btn.textContent = "Leave";
  }
}

// ── Load ────────────────────────────────────────
async function loadEvents() {
  document.getElementById("events-container").innerHTML =
    `<div class="loading"><div class="spinner"></div> Loading events…</div>`;
  try {
    allEventsCache = await api.getEvents();
    renderEvents(allEventsCache);
  } catch (err) {
    document.getElementById("events-container").innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Couldn't load events</h3>
        <p>${err.message || "Check your connection and try again."}</p>
      </div>`;
  }
}

// ── Toast ────────────────────────────────────────
function showToast(message, type = "info") {
  const c = document.getElementById("toast-container");
  const icons = { success:"✓", error:"✕", info:"ℹ" };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span> ${message}`;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ── Init ─────────────────────────────────────────
loadEvents();
