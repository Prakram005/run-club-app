import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Trophy, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";
import { GlowingText } from "../components/ui/EngagingUI";
import ModernRunCard from "../components/events/ModernRunCard";

const badgeDefinitions = [
  { id: "first-run", label: "First Run", threshold: 1, icon: "🏃", color: "#06b6d4" },
  { id: "crew-builder", label: "Crew Builder", threshold: 3, icon: "👥", color: "#8b5cf6" },
  { id: "pacer", label: "Pacer", threshold: 10, icon: "⏱️", color: "#f59e0b" },
  { id: "joiner", label: "Joiner", threshold: 5, icon: "✅", color: "#10b981" }
];

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getEvents(),
      fetch(`${api.API_URL}/users/${userId}`).then(r => r.json()).catch(() => null)
    ])
      .then(([eventsRes, userRes]) => {
        setAllEvents(eventsRes.data || []);
        if (userRes?.data) {
          setUserData(userRes.data);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const { createdEvents, joinedEvents, stats, badges } = useMemo(() => {
    const created = allEvents.filter((e) => String(e.createdBy) === userId);
    const joined = allEvents.filter((e) =>
      !created.includes(e) &&
      e.participants?.some((p) => String(typeof p === "object" ? p._id : p) === userId)
    );

    const upcomingCreated = created.filter((e) => new Date(e.date) >= new Date());
    const completedCreated = created.filter((e) => new Date(e.date) < new Date());

    const upcomingJoined = joined.filter((e) => new Date(e.date) >= new Date());
    const completedJoined = joined.filter((e) => new Date(e.date) < new Date());

    return {
      createdEvents: created,
      joinedEvents: joined,
      stats: {
        totalCreated: created.length,
        totalJoined: joined.length,
        upcomingCreated: upcomingCreated.length,
        completedCreated: completedCreated.length,
        upcomingJoined: upcomingJoined.length,
        completedJoined: completedJoined.length,
        totalParticipants: created.reduce((sum, e) => sum + (e.participants?.length || 0), 0)
      },
      badges: badgeDefinitions.filter((badge) => {
        const count = badge.id === "pacer" ? created.length : created.length;
        return count >= badge.threshold;
      })
    };
  }, [allEvents, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  const displayName = userData?.name || "Runner";
  const isOwnProfile = String(currentUser?.id) === userId;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition"
        whileHover={{ gap: "12px" }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>

      {/* Profile Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 p-8 md:p-12"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-purple-400">
              👤 Profile
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold text-white">
              {displayName}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                {stats.totalCreated + stats.totalJoined} Total Runs
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                {Math.max(0, stats.totalCreated - 1)} Events Created
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-cyan-400" />
                {stats.upcomingCreated + stats.upcomingJoined} Upcoming
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <motion.button
              onClick={() => navigate("/profile/edit")}
              className="btn-primary px-6 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
          )}
        </div>
      </motion.section>

      {/* Badges Section */}
      {badges.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 font-display text-2xl font-bold">
            <GlowingText color="yellow">✨ Badges</GlowingText>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                className="card p-6 border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-bold text-yellow-300">{badge.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Stats Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="card p-6 border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
          <p className="text-xs font-bold uppercase text-cyan-400">Created Events</p>
          <p className="mt-2 font-display text-4xl font-bold text-white">{stats.totalCreated}</p>
          <p className="mt-1 text-sm text-zinc-400">{stats.upcomingCreated} upcoming</p>
        </div>

        <div className="card p-6 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <p className="text-xs font-bold uppercase text-purple-400">Joined Events</p>
          <p className="mt-2 font-display text-4xl font-bold text-white">{stats.totalJoined}</p>
          <p className="mt-1 text-sm text-zinc-400">{stats.upcomingJoined} upcoming</p>
        </div>

        <div className="card p-6 border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <p className="text-xs font-bold uppercase text-green-400">Total Runners</p>
          <p className="mt-2 font-display text-4xl font-bold text-white">{stats.totalParticipants}</p>
          <p className="mt-1 text-sm text-zinc-400">Across all events</p>
        </div>
      </motion.section>

      {/* Created Events */}
      {createdEvents.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 font-display text-2xl font-bold">
            <GlowingText color="cyan">📍 Created Events</GlowingText>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {createdEvents
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 6)
              .map((event) => (
                <ModernRunCard key={event._id} event={event} />
              ))}
          </div>
          {createdEvents.length > 6 && (
            <motion.div className="mt-6 text-center">
              <Link
                to={`/user/${userId}/events?type=created`}
                className="btn-ghost gap-2"
              >
                View All {createdEvents.length} Events
              </Link>
            </motion.div>
          )}
        </motion.section>
      )}

      {/* Upcoming Events */}
      {createdEvents.filter((e) => new Date(e.date) >= new Date()).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 font-display text-2xl font-bold">
            <GlowingText color="purple">⏰ Upcoming</GlowingText>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {createdEvents
              .concat(joinedEvents)
              .filter((e) => new Date(e.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 6)
              .map((event) => (
                <ModernRunCard key={event._id} event={event} />
              ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
