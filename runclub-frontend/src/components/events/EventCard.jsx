import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { AnimatedEventStatus, LiveParticipantCounter } from "../ui";
import * as api from "../../utils/api";

function participantId(value) {
  return typeof value === "object" ? value?._id : value;
}

export default function EventCard({ event, onRefresh, compact = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCreator = String(event.createdBy) === String(user?.id);
  const isJoined = event.participants?.some((entry) => String(participantId(entry)) === String(user?.id));
  const isPast = new Date(event.date) < new Date();

  const handleJoinLeave = async (nextAction) => {
    if (nextAction === "join") {
      await api.joinEvent(event._id);
    } else {
      await api.leaveEvent(event._id);
    }

    onRefresh?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card-hover card border border-red-600/20 overflow-hidden transition-all hover:border-red-600/50 hover:shadow-red-glow"
    >
      {event.image && (
        <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-red-900/30 to-black">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-red-400 font-semibold">
              {isCreator ? "🔥 Organised by you" : isJoined ? "✅ Joined" : "🎯 Join us"}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-white">{event.title}</h3>
          </div>
          <AnimatedEventStatus event={event} isPast={isPast} />
        </div>

        {event.difficulty && (
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-red-600/30 text-red-300 font-medium border border-red-600/20">
              {event.difficulty === "beginner" && "🟢"}
              {event.difficulty === "intermediate" && "🟡"}
              {event.difficulty === "advanced" && "🔴"}
              {" " + (event.difficulty?.charAt(0).toUpperCase() + event.difficulty?.slice(1))}
            </span>
            {event.terrain && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-600/30 text-green-300 font-medium border border-green-600/20">
                {event.terrain === "road" && "🛣️"}
                {event.terrain === "trail" && "🥾"}
                {event.terrain === "mixed" && "🔀"}
                {" " + event.terrain}
              </span>
            )}
            {event.distance && (
              <span className="text-xs px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 font-medium border border-purple-600/20">
                📏 {event.distance}km
              </span>
            )}
            {event.pace && (
              <span className="text-xs px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 font-medium border border-blue-600/20">
                ⏱️ {event.pace}
              </span>
            )}
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-red-400" />
            <span>{format(new Date(event.date), "EEE, MMM d, h:mm a")}</span>
          </div>
          {event.location ? (
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-red-400" />
              <span className="text-gray-300">{event.location}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-3 rounded-lg bg-red-950/20 border border-red-600/20 p-4">
          <LiveParticipantCounter
            currentCount={event.participants?.length || 0}
            maxCount={event.maxParticipants || 20}
            isLive={true}
          />
        </div>

        {!compact && event.description ? (
          <p className="mt-4 text-sm text-gray-400 line-clamp-2">{event.description}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/events/${event._id}`)}
            className="btn-ghost flex-1 text-xs"
          >
            View Details
          </button>
          {!isPast && !isCreator && !isJoined ? (
            <button
              onClick={() => handleJoinLeave("join")}
              className="btn-primary flex-1 text-xs"
            >
              Join Event
            </button>
          ) : null}
          {!isPast && !isCreator && isJoined ? (
            <button
              onClick={() => handleJoinLeave("leave")}
              className="btn-danger flex-1 text-xs"
            >
              Leave Event
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
