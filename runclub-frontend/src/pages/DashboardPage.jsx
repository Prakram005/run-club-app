import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import EventCard from "../components/events/EventCard";
import { EventCardSkeleton, LiveLeaderboard } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";

const badgeDefinitions = [
  { id: "first-run", label: "First Run", threshold: 1, source: "created" },
  { id: "crew-builder", label: "Crew Builder", threshold: 3, source: "created" },
  { id: "pacer", label: "Pacer", threshold: 10, source: "created" },
  { id: "joiner", label: "Joiner", threshold: 5, source: "joined" }
];

function getParticipantId(entry) {
  return typeof entry === "object" ? entry?._id : entry;
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card p-5 cursor-pointer transition"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon size={18} className="text-brand-400" />
      </motion.div>
      <motion.p
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-4 text-3xl font-bold"
      >
        {value}
      </motion.p>
      <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const { myCreated, myJoined, upcoming, past } = useMemo(() => {
    const myId = String(user?.id || "");
    const created = events.filter((event) => String(event.createdBy) === myId);
    const joined = events.filter(
      (event) =>
        String(event.createdBy) !== myId &&
        event.participants?.some((participant) => String(getParticipantId(participant)) === myId)
    );
    const merged = [...created, ...joined];
    return {
      myCreated: created,
      myJoined: joined,
      upcoming: merged.filter((event) => new Date(event.date) >= new Date()),
      past: merged.filter((event) => new Date(event.date) < new Date())
    };
  }, [events, user]);

  const badges = badgeDefinitions.filter((badge) => {
    const count = badge.source === "created" ? myCreated.length : myJoined.length;
    return count >= badge.threshold;
  });

  const featuredEvents = upcoming
    .slice()
    .sort((left, right) => new Date(left.date) - new Date(right.date))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="card overflow-hidden p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">Welcome back</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold">Hey, {user?.name?.split(" ")[0] || "Runner"}</h1>
            <p className="mt-2 text-sm text-zinc-400">Your runs, your crew, your pace.</p>
          </div>
          <button onClick={() => navigate("/create")} className="btn-primary gap-2">
            <Plus size={16} />
            Create Run
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Events Created" value={myCreated.length} icon={Calendar} />
        <StatCard label="Events Joined" value={myJoined.length} icon={Users} />
        <StatCard label="Upcoming Runs" value={upcoming.length} icon={Calendar} />
        <StatCard label="Badges Earned" value={badges.length} icon={Trophy} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">My Upcoming Runs</h2>
          <button onClick={() => navigate("/events")} className="text-sm text-zinc-400 hover:text-brand-400">
            Browse all events
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <EventCardSkeleton key={item} />
            ))}
          </div>
        ) : featuredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-10 text-center"
          >
            <p className="font-display text-2xl font-semibold">No upcoming runs yet</p>
            <p className="mt-2 text-sm text-zinc-400">Create an event or join one to get started.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {featuredEvents.map((event) => (
              <motion.div key={event._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <EventCard event={event} onRefresh={load} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold">Badges</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {badgeDefinitions.map((badge) => {
            const earned = badges.some((entry) => entry.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`card p-5 transition ${earned ? "border-brand-400/30 bg-brand-400/5" : "opacity-50"}`}
              >
                <p className="text-sm font-semibold text-zinc-100">{badge.label}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {badge.source === "created"
                    ? `Organise ${badge.threshold} event${badge.threshold > 1 ? "s" : ""}`
                    : `Join ${badge.threshold} event${badge.threshold > 1 ? "s" : ""}`}
                </p>
                <p className="mt-4 text-xs uppercase tracking-widest text-zinc-400">
                  {earned ? "Earned" : "Locked"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {past.length > 0 ? (
        <section>
          <h2 className="mb-4 font-display text-2xl font-semibold">Past Runs</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {past.slice(0, 4).map((event) => (
              <EventCard key={event._id} event={event} onRefresh={load} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
