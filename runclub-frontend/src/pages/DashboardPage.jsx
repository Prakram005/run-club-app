import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Trophy, Users, Flame, Zap, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";
import EventCard from "../components/events/EventCard";
import { 
  EventCardSkeleton, 
  LiveLeaderboard,
  AnimatedCounter,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  ProgressRing,
  RippleButton
} from "../components/ui";
import HeroSection from "../components/layout/HeroSection";
import { AnimatedStat, StatCard } from "../components/ui/AnimatedStat";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";

const badgeDefinitions = [
  { id: "first-run", label: "First Run", threshold: 1, source: "created", emoji: "🏃" },
  { id: "crew-builder", label: "Crew Builder", threshold: 3, source: "created", emoji: "👥" },
  { id: "pacer", label: "Pacer", threshold: 10, source: "created", emoji: "⚡" },
  { id: "joiner", label: "Joiner", threshold: 5, source: "joined", emoji: "🎯" }
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

  const progressPercent = (badges.length / badgeDefinitions.length) * 100;

  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section with new component */}
      <HeroSection
        badge="🔥 Welcome back, Runner"
        title="Keep Moving"
        subtitle={`${user?.name?.split(" ")[0] || "Runner"}, your crew is waiting.`}
        description="Create runs, join your crew, and earn badges as you go."
        ctaText="Create Run"
        onCTA={() => navigate("/create")}
        secondaryCtaText="Browse Events"
        onSecondary={() => navigate("/events")}
        gradient={true}
        animate={true}
      />

      {/* Stats Grid - Enhanced with animations and counters */}
      <ScrollReveal preset="fade-up">
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          <AnimatedStat label="Events Created" value={myCreated.length} icon={Calendar} color="red" delay={0} />
          <AnimatedStat label="Events Joined" value={myJoined.length} icon={Users} color="red" delay={0.1} />
          <AnimatedStat label="Upcoming Runs" value={upcoming.length} icon={Zap} color="red" delay={0.2} />
          <AnimatedStat label="Badges Earned" value={badges.length} icon={Trophy} color="red" delay={0.3} />
        </motion.section>
      </ScrollReveal>

      {/* Achievement Progress Card */}
      <ScrollReveal preset="scale-in" delay={0.1}>
        <motion.div
          whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(255, 26, 26, 0.3)" }}
          className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/20 to-black p-8 backdrop-blur-md transition-all duration-300"
        >
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">Achievement Progress</h3>
              <p className="mt-2 text-zinc-400">Complete all 4 badges to become a Run Club legend</p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-zinc-300">
                    <AnimatedCounter value={badges.length} suffix={`/${badgeDefinitions.length}`} />
                  </span>
                  <span className="text-xs text-red-400 font-bold">{Math.round(progressPercent)}%</span>
                </div>
                
                {/* Animated progress bar */}
                <div className="h-2 rounded-full bg-black/50 border border-red-400/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-red-500 to-red-700"
                  />
                </div>
              </motion.div>
            </div>

            {/* Progress Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center md:justify-end"
            >
              <ProgressRing 
                progress={progressPercent}
                size={140}
                showLabel={true}
                label="Badges"
              />
            </motion.div>
          </div>
        </motion.div>
      </ScrollReveal>

      {/* Featured Events */}
      <ScrollReveal preset="fade-up" delay={0.2}>
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="mb-8 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-3xl font-bold text-white">My Upcoming Runs</h2>
              <p className="mt-2 text-sm text-gray-400">Stay connected with your crew</p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.08, x: 4 }}
              onClick={() => navigate("/events")}
              className="text-sm font-semibold text-red-400 hover:text-red-300 transition uppercase tracking-wider"
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
              className="rounded-2xl border-2 border-red-600/30 bg-gradient-to-br from-red-950/10 to-black p-12 text-center backdrop-blur-md"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Zap size={48} className="mx-auto mb-4 text-red-400" />
              </motion.div>
              <p className="font-display text-2xl font-bold text-white">No upcoming runs yet</p>
              <p className="mt-2 text-gray-400">Create an event or join one to get started.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/create")}
                className="btn-primary mt-6"
              >
                Create Run
              </motion.button>
            </motion.div>
          ) : (
            <StaggerContainer staggerDelay={0.08} delayChildren={0}>
              <div className="grid gap-5 md:grid-cols-2">
                {featuredEvents.map((event) => (
                  <StaggerItem key={event._id}>
                    <EventCard event={event} onRefresh={load} />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}
        </motion.section>
      </ScrollReveal>

      {/* Badges Section - Enhanced */}
      <ScrollReveal preset="fade-up" delay={0.3}>
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="font-display text-3xl font-bold text-white"
            >
              🏆 Your Badges
            </motion.h2>
            <p className="mt-2 text-sm text-gray-400">Achievements unlock at milestones</p>
          </div>

          <StaggerContainer staggerDelay={0.06}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {badgeDefinitions.map((badge, idx) => {
                const earned = badges.some((entry) => entry.id === badge.id);
                return (
                  <StaggerItem key={badge.id} custom={idx}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={earned ? { scale: 1.06, y: -6 } : {}}
                      transition={{ duration: 0.3 }}
                      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-md transition-all cursor-pointer group ${
                        earned
                          ? "border-2 border-red-600/60 bg-gradient-to-br from-red-600/25 to-red-900/15 shadow-red-glow"
                          : "border-2 border-gray-700/30 bg-black/40 opacity-50"
                      }`}
                    >
                      {/* Glow effect on earn */}
                      {earned && (
                        <>
                          <motion.div
                            animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-2 right-2 w-8 h-8 border-2 border-red-500/50 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 border-2 border-red-500/30 rounded-2xl"
                          />
                        </>
                      )}

                      {/* Badge content */}
                      <motion.div
                        animate={earned ? { y: [0, -4, 0] } : {}}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                      >
                        <div className="text-3xl mb-2">{badge.emoji}</div>
                        <p className="text-lg font-bold text-white">{badge.label}</p>
                        <p className="mt-2 text-xs text-gray-400">
                          {badge.source === "created"
                            ? `Organize ${badge.threshold} event${badge.threshold > 1 ? "s" : ""}`
                            : `Join ${badge.threshold} event${badge.threshold > 1 ? "s" : ""}`}
                        </p>
                      </motion.div>

                      <motion.p
                        animate={{ opacity: earned ? 1 : 0.6 }}
                        className={`mt-4 text-xs font-bold uppercase tracking-wider ${
                          earned ? "text-red-400" : "text-gray-500"
                        }`}
                      >
                        {earned ? "✨ Unlocked" : "🔒 Locked"}
                      </motion.p>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </motion.section>
      </ScrollReveal>
      {/* Past Runs */}
      {past.length > 0 && (
        <ScrollReveal preset="fade-up" delay={0.4}>
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="font-display text-3xl font-bold text-white"
              >
                🏁 Past Runs
              </motion.h2>
              <p className="mt-2 text-sm text-zinc-400">Your running history</p>
            </div>

            <StaggerContainer staggerDelay={0.08}>
              <div className="grid gap-4 md:grid-cols-2">
                {past.slice(0, 4).map((event) => (
                  <StaggerItem key={event._id}>
                    <EventCard event={event} onRefresh={load} compact />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </motion.section>
        </ScrollReveal>
      )}

      {/* CTA Section - Call to Action for more engagement */}
      <ScrollReveal preset="scale-in" delay={0.5}>
        <motion.section
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600/40 to-red-900/20 border border-red-500/30 p-12 text-center backdrop-blur-md"
        >
          {/* Animated background */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, linear: true }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, linear: true }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-3xl font-bold text-white">Ready to connect?</h3>
            <p className="mt-3 text-lg text-red-100">Join the Run Club community and find your crew.</p>

            <motion.div
              className="mt-8 flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <RippleButton
                onClick={() => navigate("/events")}
                variant="primary"
              >
                Browse Events
              </RippleButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create")}
                className="btn-ghost"
              >
                Host a Run
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>
      </ScrollReveal>
    </div>
  );
}
