import { useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { AnimatedEventStatus, LiveParticipantCounter, RippleButton } from "../ui";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isCreator = String(event.createdBy) === String(user?.id);
  const isJoined = event.participants?.some((entry) => String(participantId(entry)) === String(user?.id));
  const isPast = new Date(event.date) < new Date();
  const reviews = event.reviews || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

  const handleJoinLeave = async (nextAction) => {
    setActionLoading(true);

    try {
      if (nextAction === "join") {
        await api.joinEvent(event._id);
        toast.success("You've joined the event!");
      } else {
        await api.leaveEvent(event._id);
        toast.success("You've left the event");
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={() => !compact && setIsExpanded(!isExpanded)}
      className="card-hover card group overflow-hidden border border-red-500/15 cursor-pointer transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <AnimatePresence>
          {event.image ? (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-red-950/50 to-black"
            >
              <motion.img
                src={event.image}
                alt={event.title}
                onLoad={() => setImageLoaded(true)}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay gradient with animation */}
              <motion.div
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="relative h-32 w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,26,26,0.22),transparent_45%),linear-gradient(145deg,rgba(30,0,0,0.9),rgba(5,5,5,1))]"
            >
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
              
              {/* Animated gradient overlay */}
              <motion.div
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"
                style={{ backgroundSize: "200% 200%" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge with stagger animation */}
        <motion.div
          className="absolute left-4 top-4 flex flex-wrap gap-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            whileHover={{ scale: 1.05, x: 4 }}
            className="rounded-full border border-red-400/20 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200 backdrop-blur transition-all"
          >
            {isCreator ? "📌 Organized by you" : isJoined ? "✓ You're in" : "🎯 Open spot"}
          </motion.span>
        </motion.div>

        <motion.div
          className="absolute right-4 top-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatedEventStatus event={event} isPast={isPast} />
        </motion.div>
      </div>

      <motion.div
        className="flex flex-col gap-5 p-5"
        initial={false}
        animate={{ gap: isExpanded ? 6 : 5 }}
      >
        {/* Title with gradient animation on hover */}
        <motion.div className="space-y-2 group/title">
          <motion.h3
            whileHover={{ color: "#ff6666" }}
            className="font-display text-[1.45rem] font-bold leading-tight text-white transition-colors duration-300"
          >
            {event.title}
          </motion.h3>
          
          <AnimatePresence>
            {!compact && event.description && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="line-clamp-2 text-sm leading-6 text-zinc-400"
              >
                {event.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tags with stagger animation */}
        {(event.difficulty || event.terrain || event.distance || event.pace) ? (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {event.difficulty && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                className={tonePill()}
              >
                {event.difficulty}
              </motion.span>
            )}
            {event.terrain && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                className={tonePill()}
              >
                {event.terrain}
              </motion.span>
            )}
            {event.distance && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                className={tonePill()}
              >
                {event.distance} km
              </motion.span>
            )}
            {event.pace && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                className={tonePill()}
              >
                {event.pace}
              </motion.span>
            )}
          </motion.div>
        ) : null}

        {/* Date and location grid with animation */}
        <motion.div
          className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2"
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "rgba(255, 102, 102, 0.3)" }}
            className="rounded-2xl border border-white/10 bg-black/35 p-3 transition-all duration-300"
          >
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar size={14} className="text-red-300" />
              <span className="text-xs uppercase tracking-[0.22em]">Date</span>
            </div>
            <motion.p
              className="mt-2 font-semibold text-white"
              animate={{ y: isExpanded ? 0 : 0 }}
            >
              {format(new Date(event.date), "EEE, MMM d")}
            </motion.p>
            <p className="text-xs text-zinc-500">{format(new Date(event.date), "h:mm a")}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, borderColor: "rgba(255, 102, 102, 0.3)" }}
            className="rounded-2xl border border-white/10 bg-black/35 p-3 transition-all duration-300"
          >
            <div className="flex items-center gap-2 text-zinc-500">
              <MapPin size={14} className="text-red-300" />
              <span className="text-xs uppercase tracking-[0.22em]">Location</span>
            </div>
            <p className="mt-2 truncate font-semibold text-white">{event.location || "Meetup TBA"}</p>
          </motion.div>
        </motion.div>

        {/* Participant counter with animation */}
        <div className="grid gap-3 sm:grid-cols-2">
          <motion.div
            className="rounded-[24px] border border-red-500/15 bg-black/35 p-4"
            whileHover={{ borderColor: "rgba(255, 102, 102, 0.3)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            transition={{ duration: 0.3 }}
          >
            <LiveParticipantCounter
              currentCount={event.participants?.length || 0}
              maxCount={event.maxParticipants || 20}
              isLive={true}
            />
          </motion.div>

          <motion.div
            className="rounded-[24px] border border-red-500/15 bg-black/35 p-4"
            whileHover={{ borderColor: "rgba(255, 102, 102, 0.3)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 text-zinc-500">
              <Star size={14} className="text-red-300" />
              <span className="text-xs uppercase tracking-[0.22em]">Reviews</span>
            </div>
            <p className="mt-2 font-semibold text-white">
              {reviews.length ? `${averageRating.toFixed(1)} / 5` : "No reviews"}
            </p>
            <p className="text-xs text-zinc-500">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </motion.div>
        </div>

        {/* Action buttons with ripple effect */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event._id}`);
            }}
            className="btn-ghost flex-1 gap-2 text-xs group/details"
          >
            <span>View Details</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronRight size={14} />
            </motion.div>
          </motion.button>

          {!isPast && !isCreator && !isJoined ? (
            <RippleButton
              onClick={(e) => {
                e.stopPropagation();
                handleJoinLeave("join");
              }}
              disabled={actionLoading}
              variant="primary"
              className="flex-1 text-xs"
            >
              {actionLoading ? "Joining..." : "Join Event"}
            </RippleButton>
          ) : null}

          {!isPast && !isCreator && isJoined ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleJoinLeave("leave");
              }}
              disabled={actionLoading}
              className="btn-danger flex-1 text-xs"
            >
              {actionLoading ? "Leaving..." : "Leave Event"}
            </motion.button>
          ) : null}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
