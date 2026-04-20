import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Flame, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";
import { GlowingText } from "../components/ui/EngagingUI";
import { RouteSkeleton } from "../components/ui";
import ModernRunCard from "../components/events/ModernRunCard";

const badgeDefinitions = [
  { id: "first-run", label: "First Run", threshold: 1 },
  { id: "crew-builder", label: "Crew Builder", threshold: 3 },
  { id: "pacer", label: "Pacer", threshold: 10 },
  { id: "joiner", label: "Joiner", threshold: 5 }
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
      fetch(`${api.API_URL}/users/${userId}`).then((response) => response.json()).catch(() => null)
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
    const created = allEvents.filter((event) => String(event.createdBy) === userId);
    const joined = allEvents.filter(
      (event) =>
        !created.includes(event) &&
        event.participants?.some((participant) => String(typeof participant === "object" ? participant._id : participant) === userId)
    );

    const upcomingCreated = created.filter((event) => new Date(event.date) >= new Date());
    const upcomingJoined = joined.filter((event) => new Date(event.date) >= new Date());

    return {
      createdEvents: created,
      joinedEvents: joined,
      stats: {
        totalCreated: created.length,
        totalJoined: joined.length,
        upcomingCreated: upcomingCreated.length,
        upcomingJoined: upcomingJoined.length,
        totalParticipants: created.reduce((sum, event) => sum + (event.participants?.length || 0), 0)
      },
      badges: badgeDefinitions.filter((badge) => {
        const count = badge.id === "joiner" ? joined.length : created.length;
        return count >= badge.threshold;
      })
    };
  }, [allEvents, userId]);

  if (loading) {
    return <RouteSkeleton title="Loading profile" description="Pulling runner stats, created events, and upcoming runs." />;
  }

  const displayName = userData?.name || "Runner";
  const isOwnProfile = String(currentUser?.id) === userId;
  const totalRuns = stats.totalCreated + stats.totalJoined;
  const upcomingRuns = stats.upcomingCreated + stats.upcomingJoined;

  return (
    <div className="space-y-8">
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-red-300 transition hover:text-red-200"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated overflow-hidden border border-red-500/20 p-8 md:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,26,26,0.14),transparent_35%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-red-300">Profile</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-white">{displayName}</h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-red-300" />
                {totalRuns} total runs
              </div>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-red-300" />
                {stats.totalCreated} organized
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-red-300" />
                {upcomingRuns} upcoming
              </div>
            </div>
          </div>

          {isOwnProfile ? (
            <motion.button
              onClick={() => navigate("/profile/edit")}
              className="btn-primary px-6 py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Profile
            </motion.button>
          ) : null}
        </div>
      </motion.section>

      {badges.length > 0 ? (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-4 font-display text-2xl font-bold text-white">
            <GlowingText color="gold">Unlocked badges</GlowingText>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.03, y: -4 }}
                className="card p-6 border border-red-400/20 bg-red-500/10 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-black/45 text-lg font-bold text-red-200">
                  {badge.threshold}
                </div>
                <p className="mt-4 font-bold text-white">{badge.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">milestone badge</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="card p-6 border border-red-400/20 bg-red-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">Created Events</p>
          <p className="mt-3 font-display text-4xl font-bold text-white">{stats.totalCreated}</p>
          <p className="mt-2 text-sm text-zinc-400">{stats.upcomingCreated} upcoming</p>
        </div>

        <div className="card p-6 border border-red-400/20 bg-black/45">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">Joined Events</p>
          <p className="mt-3 font-display text-4xl font-bold text-white">{stats.totalJoined}</p>
          <p className="mt-2 text-sm text-zinc-400">{stats.upcomingJoined} upcoming</p>
        </div>

        <div className="card p-6 border border-red-400/20 bg-black/45">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">Total Runners</p>
          <p className="mt-3 font-display text-4xl font-bold text-white">{stats.totalParticipants}</p>
          <p className="mt-2 text-sm text-zinc-400">Across organized events</p>
        </div>
      </motion.section>

      {createdEvents.length > 0 ? (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="mb-4 font-display text-2xl font-bold text-white">
            <GlowingText color="red">Created runs</GlowingText>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {createdEvents
              .slice()
              .sort((left, right) => new Date(right.date) - new Date(left.date))
              .slice(0, 6)
              .map((event) => (
                <ModernRunCard key={event._id} event={event} />
              ))}
          </div>
          {createdEvents.length > 6 ? (
            <motion.div className="mt-6 text-center">
              <Link to={`/user/${userId}/events?type=created`} className="btn-ghost gap-2">
                View All {createdEvents.length} Events
              </Link>
            </motion.div>
          ) : null}
        </motion.section>
      ) : null}

      {upcomingRuns > 0 ? (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="mb-4 font-display text-2xl font-bold text-white">
            <GlowingText color="soft">Upcoming schedule</GlowingText>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {createdEvents
              .concat(joinedEvents)
              .filter((event) => new Date(event.date) >= new Date())
              .sort((left, right) => new Date(left.date) - new Date(right.date))
              .slice(0, 6)
              .map((event) => (
                <ModernRunCard key={event._id} event={event} />
              ))}
          </div>
        </motion.section>
      ) : null}
    </div>
  );
}
