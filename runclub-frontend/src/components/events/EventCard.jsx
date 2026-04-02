import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
    <div className="card flex flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-400">
            {isCreator ? "Organised by you" : isJoined ? "Joined run" : "Community run"}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold">{event.title}</h3>
        </div>
        {isPast ? (
          <span className="rounded-full border border-zinc-700 px-2 py-1 text-[11px] text-zinc-400">Past</span>
        ) : null}
      </div>

      <div className="space-y-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-brand-400" />
          <span>{format(new Date(event.date), "EEE, MMM d, h:mm a")}</span>
        </div>
        {event.location ? (
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-red-400" />
            <span>{event.location}</span>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <Users size={15} className="text-blue-400" />
          <span>
            {event.participants?.length || 0} / {event.maxParticipants || 20} runners
          </span>
        </div>
      </div>

      {!compact && event.description ? (
        <p className="mt-4 text-sm text-zinc-500">{event.description}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => navigate(`/events/${event._id}`)} className="btn-ghost">
          View Details
        </button>
        {!isPast && !isCreator && !isJoined ? (
          <button onClick={() => handleJoinLeave("join")} className="btn-primary">
            Join Event
          </button>
        ) : null}
        {!isPast && !isCreator && isJoined ? (
          <button onClick={() => handleJoinLeave("leave")} className="btn-danger">
            Leave Event
          </button>
        ) : null}
      </div>
    </div>
  );
}
