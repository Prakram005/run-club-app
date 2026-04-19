import { useEffect, useMemo, useState } from "react";
import { Plus, Search, SortAsc, SortDesc, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import EventFilter from "../components/events/EventFilter";
import { EmptyState, EventCardSkeleton } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";

const tabs = [
  { id: "my", label: "My Runs" },
  { id: "joined", label: "Joined" },
  { id: "all", label: "All Events" }
];

function getParticipantId(entry) {
  return typeof entry === "object" ? entry?._id : entry;
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("my");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [filters, setFilters] = useState({
    difficulty: [],
    terrain: [],
    minDistance: "",
    maxDistance: "",
    pace: ""
  });

  const load = () => {
    setLoading(true);
    api
      .getEvents()
      .then((response) => setEvents(response.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const myId = String(user?.id || "");
    let list = [...events];

    if (tab === "my") {
      list = list.filter((event) => String(event.createdBy) === myId);
    } else if (tab === "joined") {
      list = list.filter((event) =>
        event.participants?.some((participant) => String(getParticipantId(participant)) === myId)
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((event) =>
        [event.title, event.location, event.description].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        )
      );
    }

    // Apply advanced filters
    if (filters.difficulty.length > 0) {
      list = list.filter((event) => filters.difficulty.includes(event.difficulty));
    }

    if (filters.terrain.length > 0) {
      list = list.filter((event) => filters.terrain.includes(event.terrain));
    }

    if (filters.minDistance) {
      list = list.filter((event) => (event.distance || 0) >= Number(filters.minDistance));
    }

    if (filters.maxDistance) {
      list = list.filter((event) => (event.distance || 0) <= Number(filters.maxDistance));
    }

    list.sort((left, right) => {
      const diff = new Date(left.date) - new Date(right.date);
      return sort === "asc" ? diff : -diff;
    });

    return list;
  }, [events, search, sort, tab, user, filters]);

  const myId = String(user?.id || "");
  const myCount = events.filter((event) => String(event.createdBy) === myId).length;
  const joinedCount = events.filter((event) =>
    event.participants?.some((participant) => String(getParticipantId(participant)) === myId)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Community</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Events</h1>
          <p className="mt-2 text-sm text-zinc-400">Find a run. Join the crew. Show up.</p>
        </div>
        <button onClick={() => navigate("/create")} className="btn-primary gap-2">
          <Plus size={16} />
          Create Event
        </button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              tab === item.id ? "bg-brand-400 text-zinc-950" : "text-zinc-400 hover:text-white"
            }`}
          >
            {item.label}
            {item.id === "my" && myCount > 0 ? ` (${myCount})` : ""}
            {item.id === "joined" && joinedCount > 0 ? ` (${joinedCount})` : ""}
          </button>
        ))}
      </div>

      <EventFilter 
        onFilter={setFilters} 
        onReset={() => setFilters({
          difficulty: [],
          terrain: [],
          minDistance: "",
          maxDistance: "",
          pace: ""
        })}
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input pl-10"
            placeholder="Search by title or location"
          />
        </div>
        <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")} className="btn-ghost gap-2">
          {sort === "asc" ? <SortAsc size={15} /> : <SortDesc size={15} />}
          {sort === "asc" ? "Earliest" : "Latest"}
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <EventCardSkeleton key={item} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Zap}
          title={
            tab === "my"
              ? "No events created yet"
              : tab === "joined"
                ? "You have not joined any events"
                : search
                  ? "No events match your search"
                  : "No events yet"
          }
          description={
            tab === "my"
              ? "Create your first run and get people moving."
              : tab === "joined"
                ? "Browse all events and join one."
                : "Be the first to create a community run."
          }
          action={
            tab === "my" ? (
              <button onClick={() => navigate("/create")} className="btn-primary gap-2">
                <Plus size={15} />
                Create Event
              </button>
            ) : (
              <button onClick={() => setTab("all")} className="btn-ghost">
                Browse All Events
              </button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((event) => (
            <EventCard key={event._id} event={event} onRefresh={load} />
          ))}
        </div>
      )}
    </div>
  );
}
