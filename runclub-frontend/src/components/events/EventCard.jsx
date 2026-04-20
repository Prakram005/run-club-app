import { useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { AnimatedEventStatus, LiveParticipantCounter } from "../ui";
import * as api from "../../utils/api";

function participantId(value) {
  return typeof value === "object" ? value?._id : value;
}

function tonePill(label) {
  return "rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100";
}

export default function EventCard({ event, onRefresh, compact = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const isCreator = String(event.createdBy) === String(user?.id);
  const isJoined = event.participants?.some((entry) => String(participantId(entry)) === String(user?.id));
  const isPast = new Date(event.date) < new Date();

  const handleJoinLeave = async (nextAction) => {
    setActionLoading(true);

    try {
      if (nextAction === "join") {
        await api.joinEvent(event._id);
      } else {
        await api.leaveEvent(event._id);
      }

      onRefresh?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update your event status.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="card-hover card group overflow-hidden border border-red-500/15"
    >
      <div className="relative">
        {event.image ? (
          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-red-950/50 to-black">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          </div>
        ) : (
          <div className="relative h-32 w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,26,26,0.22),transparent_45%),linear-gradient(145deg,rgba(30,0,0,0.9),rgba(5,5,5,1))]">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-red-400/20 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200 backdrop-blur">
            {isCreator ? "Organized by you" : isJoined ? "You're in" : "Open spot"}
          </span>
        </div>

        <div className="absolute right-4 top-4">
          <AnimatedEventStatus event={event} isPast={isPast} />
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div className="space-y-2">
          <h3 className="font-display text-[1.45rem] font-bold leading-tight text-white">{event.title}</h3>
          {!compact && event.description ? (
            <p className="line-clamp-2 text-sm leading-6 text-zinc-400">{event.description}</p>
          ) : null}
        </div>

        {(event.difficulty || event.terrain || event.distance || event.pace) ? (
          <div className="flex flex-wrap gap-2">
            {event.difficulty ? <span className={tonePill()}>{event.difficulty}</span> : null}
            {event.terrain ? <span className={tonePill()}>{event.terrain}</span> : null}
            {event.distance ? <span className={tonePill()}>{event.distance} km</span> : null}
            {event.pace ? <span className={tonePill()}>{event.pace}</span> : null}
          </div>
        ) : null}

        <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar size={14} className="text-red-300" />
              <span className="text-xs uppercase tracking-[0.22em]">Date</span>
            </div>
            <p className="mt-2 font-semibold text-white">{format(new Date(event.date), "EEE, MMM d")}</p>
            <p className="text-xs text-zinc-500">{format(new Date(event.date), "h:mm a")}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <MapPin size={14} className="text-red-300" />
              <span className="text-xs uppercase tracking-[0.22em]">Location</span>
            </div>
            <p className="mt-2 truncate font-semibold text-white">{event.location || "Meetup TBA"}</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-red-500/15 bg-black/35 p-4">
          <LiveParticipantCounter
            currentCount={event.participants?.length || 0}
            maxCount={event.maxParticipants || 20}
            isLive={true}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate(`/events/${event._id}`)} className="btn-ghost flex-1 gap-2 text-xs">
            View Details
          </button>

          {!isPast && !isCreator && !isJoined ? (
            <button
              onClick={() => handleJoinLeave("join")}
              disabled={actionLoading}
              className="btn-primary flex-1 text-xs"
            >
              {actionLoading ? "Joining..." : "Join Event"}
            </button>
          ) : null}

          {!isPast && !isCreator && isJoined ? (
            <button
              onClick={() => handleJoinLeave("leave")}
              disabled={actionLoading}
              className="btn-danger flex-1 text-xs"
            >
              {actionLoading ? "Leaving..." : "Leave Event"}
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
