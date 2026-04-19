import { useEffect, useMemo, useState } from "react";
import { Plus, Search, SortAsc, SortDesc, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">🔥 Community</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-gradient-white-red">Events</h1>
          <p className="mt-2 text-sm text-gray-400">Find a run. Join the crew. Show up and crush it.</p>
        </div>
        <motion.button
          onClick={() => navigate("/create")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary-glow gap-2"
        >
          <Plus size={18} />
          Create Event
        </motion.button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 rounded-xl border border-red-600/30 bg-black/40 p-1 backdrop-blur"
      >
        {tabs.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setTab(item.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === item.id
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            {item.label}
            {item.id === "my" && myCount > 0 ? ` (${myCount})` : ""}
            {item.id === "joined" && joinedCount > 0 ? ` (${joinedCount})` : ""}
          </motion.button>
        ))}
      </motion.div>

      {/* Filters */}
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

      {/* Search & Sort */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-400/50" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input pl-10"
            placeholder="Search by title or location"
          />
        </div>
        <motion.button
          onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-ghost gap-2"
        >
          {sort === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          {sort === "asc" ? "Earliest" : "Latest"}
        </motion.button>
      </motion.div>

      {/* Events List */}
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
              <motion.button
                onClick={() => navigate("/create")}
                whileHover={{ scale: 1.05 }}
                className="btn-primary gap-2"
              >
                <Plus size={16} />
                Create Event
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setTab("all")}
                whileHover={{ scale: 1.05 }}
                className="btn-ghost"
              >
                Browse All Events
              </motion.button>
            )
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {filtered.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EventCard event={event} onRefresh={load} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
