import { motion } from "framer-motion";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const gradientMap = {
  morning: "from-red-500/20 via-red-800/15 to-black",
  afternoon: "from-red-600/20 via-red-900/15 to-black",
  evening: "from-red-700/20 via-black to-black",
  night: "from-red-950/30 via-black to-black"
};

function getTimeOfDay(date) {
  const hour = new Date(date).getHours();

  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export default function ModernRunCard({ event, isJoined, onJoin, onLeave }) {
  const navigate = useNavigate();
  const timeOfDay = getTimeOfDay(event.date);
  const isPast = new Date(event.date) < new Date();
  const participants = event.participants?.length || 0;

  const handlePrimaryAction = () => {
    if (isJoined && onLeave) {
      onLeave();
      return;
    }

    if (!isJoined && onJoin) {
      onJoin();
      return;
    }

    navigate(`/events/${event._id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="card group overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[timeOfDay]} opacity-80`} />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative flex h-full flex-col">
        {event.image ? (
          <div className="h-36 w-full overflow-hidden bg-black/40">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
                {timeOfDay}
              </span>
              <h3 className="mt-3 text-xl font-bold text-white">{event.title}</h3>
            </div>
            {isPast ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                Completed
              </span>
            ) : null}
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Distance</p>
              <p className="mt-2 text-sm font-bold text-red-200">{event.distance ? `${event.distance} km` : "TBD"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Time</p>
              <p className="mt-2 text-sm font-bold text-white">{format(new Date(event.date), "HH:mm")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">People</p>
              <p className="mt-2 text-sm font-bold text-white">{participants}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-red-300" />
              <span className="truncate">{event.location || "Pinned meetup spot"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-red-300" />
              <span>{format(new Date(event.date), "EEEE, MMM d, yyyy")}</span>
            </div>
            {event.pace ? (
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-red-300" />
                <span>{event.pace}</span>
              </div>
            ) : null}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrimaryAction}
            className={`mt-6 w-full rounded-2xl py-3 text-sm font-bold uppercase tracking-[0.24em] transition-all ${
              isJoined && onLeave
                ? "border border-red-400/30 bg-red-600/15 text-red-100 shadow-red-glow-sm"
                : "border border-red-400/30 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
            }`}
          >
            {isJoined && onLeave ? "Leave Run" : onJoin ? "Join Run" : "View Run"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
