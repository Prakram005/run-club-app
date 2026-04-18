import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Trophy, Users, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";
import EventCard from "../components/events/EventCard";
import { EventCardSkeleton, LiveLeaderboard } from "../components/ui";
import { AnimatedStat, StatCard } from "../components/ui/AnimatedStat";
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
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/30 p-8 md:p-12"
      >
        {/* Animated background gradient */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl"
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400"
              >
                🏃 Welcome back, Runner
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 font-display text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              >
                Let's Keep Moving
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-lg text-zinc-300"
              >
                {user?.name?.split(" ")[0] || "Runner"}, your crew is waiting.
              </motion.p>
            </div>
            <motion.button
              onClick={() => navigate("/create")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold uppercase tracking-wider overflow-hidden shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/75 transition-shadow md:flex-shrink-0"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative flex items-center justify-center gap-2">
                <Plus size={20} />
                Create Run
              </span>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid - Modern animated cards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <AnimatedStat label="Events Created" value={myCreated.length} icon={Calendar} color="cyan" delay={0} />
        <AnimatedStat label="Events Joined" value={myJoined.length} icon={Users} color="purple" delay={0.1} />
        <AnimatedStat label="Upcoming Runs" value={upcoming.length} icon={Zap} color="green" delay={0.2} />
        <AnimatedStat label="Badges Earned" value={badges.length} icon={Trophy} color="orange" delay={0.3} />
      </motion.section>

      {/* Featured Events */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-white">My Upcoming Runs</h2>
            <p className="mt-2 text-sm text-zinc-400">Stay connected with your crew</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/events")}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition uppercase tracking-wider"
          >
            Browse All →
          </motion.button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <EventCardSkeleton key={item} />
            ))}
          </div>
        ) : featuredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-12 text-center backdrop-blur-md"
          >
            <Zap size={48} className="mx-auto mb-4 text-cyan-400" />
            <p className="font-display text-2xl font-bold text-white">No upcoming runs yet</p>
            <p className="mt-2 text-zinc-400">Create an event or join one to get started.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/create")}
              className="mt-6 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold"
            >
              Create Run
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
            className="grid gap-5 md:grid-cols-2"
          >
            {featuredEvents.map((event) => (
              <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <EventCard event={event} onRefresh={load} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Badges Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-white">🏆 Your Badges</h2>
          <p className="mt-2 text-sm text-zinc-400">Achievements unlock at milestones</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {badgeDefinitions.map((badge, idx) => {
            const earned = badges.some((entry) => entry.id === badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                whileHover={earned ? { scale: 1.05 } : {}}
                className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-md transition-all ${
                  earned
                    ? "border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 shadow-lg shadow-yellow-500/20"
                    : "border-2 border-zinc-700/50 bg-white/5 opacity-50"
                }`}
              >
                {earned && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, linear: true }}
                    className="absolute top-2 right-2 w-8 h-8 border-2 border-yellow-500/50 rounded-full"
                  />
                )}
                <p className="text-lg font-bold text-white">{badge.label}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  {badge.source === "created"
                    ? `Organize ${badge.threshold} event${badge.threshold > 1 ? "s" : ""}`
                    : `Join ${badge.threshold} event${badge.threshold > 1 ? "s" : ""}`}
                </p>
                <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${earned ? "text-yellow-400" : "text-zinc-500"}`}>
                  {earned ? "✨ Unlocked" : "🔒 Locked"}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Past Runs */}
      {past.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-white">Past Runs</h2>
            <p className="mt-2 text-sm text-zinc-400">Your running history</p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {past.slice(0, 4).map((event) => (
              <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <EventCard event={event} onRefresh={load} compact />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}
    </div>
  );
}
