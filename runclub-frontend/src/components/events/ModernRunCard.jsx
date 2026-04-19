import { motion } from "framer-motion";
import { MapPin, Clock, Zap, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function ModernRunCard({ event, isJoined, onJoin, onLeave }) {
  const colorMap = {
    morning: "from-orange-500 to-yellow-500",
    afternoon: "from-cyan-500 to-blue-500",
    evening: "from-purple-500 to-pink-500",
    night: "from-blue-500 to-indigo-500"
  };

  const getTimeOfDay = (date) => {
    const hour = new Date(date).getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 21) return "evening";
    return "night";
  };

  const timeOfDay = getTimeOfDay(event.date);
  const colorGradient = colorMap[timeOfDay];
  const isPast = new Date(event.date) < new Date();
  const participants = event.participants?.length || 0;
  const distance = Math.random() * 10 + 2; // Mock distance

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Glassmorphism background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-10`} />
      
      <div className="relative border-2 border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-colors group flex flex-col">
        {/* Event Image */}
        {event.image && (
          <div className="h-36 w-full overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10 p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${colorGradient} bg-opacity-20 border border-white/10 mb-3`}>
                <Zap size={12} className="text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {timeOfDay === "morning" && "🌅 Morning"}
                  {timeOfDay === "afternoon" && "☀️ Afternoon"}
                  {timeOfDay === "evening" && "🌅 Evening"}
                  {timeOfDay === "night" && "🌙 Night"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {event.title}
              </h3>
            </div>
            {isPast && (
              <div className="text-xs font-bold text-green-400 uppercase">✓ Completed</div>
            )}
          </div>

          {/* Difficulty & Terrain badges */}
          {(event.difficulty || event.terrain || event.distance || event.pace) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.difficulty && (
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  {event.difficulty === "beginner" && "🟢"}
                  {event.difficulty === "intermediate" && "🟡"}
                  {event.difficulty === "advanced" && "🔴"}
                  {" " + event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
                </span>
              )}
              {event.terrain && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                  {event.terrain === "road" && "🛣️"}
                  {event.terrain === "trail" && "🥾"}
                  {event.terrain === "mixed" && "🔀"}
                  {" " + event.terrain}
                </span>
              )}
              {event.distance && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                  📏 {event.distance}km
                </span>
              )}
              {event.pace && (
                <span className="text-xs px-2 py-1 rounded-full bg-lime-500/20 text-lime-300">
                  ⏱️ {event.pace}
                </span>
              )}
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Distance */}
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Distance</p>
              <p className="text-lg font-bold text-cyan-400">{event.distance || distance.toFixed(1)} km</p>
            </div>

            {/* Time */}
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">Time</p>
              <p className="text-lg font-bold text-purple-400">
                {format(new Date(event.date), "HH:mm")}
              </p>
            </div>

            {/* Participants */}
            <div className="rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-1">People</p>
              <p className="text-lg font-bold text-pink-400">{participants}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-zinc-300 mb-6">
            <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
            <span className="truncate">{event.location || "TBA"}</span>
          </div>

          {/* Date */}
          <p className="text-xs text-zinc-400 mb-6">
            📅 {format(new Date(event.date), "EEEE, MMM d, yyyy")}
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (isJoined ? onLeave?.() : onJoin?.())}
            className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
              isJoined
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40 hover:shadow-green-500/60"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60"
            }`}
          >
            {isJoined ? "✓ Joined" : "Join Run"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
