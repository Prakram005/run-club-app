import { motion } from "framer-motion";
import { AlertCircle, Clock, Play, CheckCircle } from "lucide-react";

export default function AnimatedEventStatus({ event, isPast }) {
  const now = new Date();
  const eventDate = new Date(event.date);
  const timeUntilEvent = eventDate - now;
  const isStarting = timeUntilEvent > 0 && timeUntilEvent < 3600000; // Within 1 hour
  const isInProgress = timeUntilEvent <= 0 && timeUntilEvent > -5400000; // Within 1.5 hours after
  const isCompleted = timeUntilEvent <= -5400000;

  let status, Icon, bgColor, textColor;

  if (isPast || isCompleted) {
    status = "Completed";
    Icon = CheckCircle;
    bgColor = "border border-white/10 bg-white/5";
    textColor = "text-zinc-300";
  } else if (isInProgress) {
    status = "In Progress";
    Icon = Play;
    bgColor = "border border-red-400/20 bg-red-500/15";
    textColor = "text-red-200";
  } else if (isStarting) {
    status = "Starting Soon";
    Icon = AlertCircle;
    bgColor = "border border-red-400/20 bg-red-500/10";
    textColor = "text-red-300";
  } else {
    status = "Upcoming";
    Icon = Clock;
    bgColor = "border border-white/10 bg-white/5";
    textColor = "text-zinc-300";
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${bgColor}`}
    >
      {(isInProgress || isStarting) && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Icon size={14} className={textColor} />
        </motion.div>
      )}
      {!isInProgress && !isStarting && <Icon size={14} className={textColor} />}
      <span className={`text-xs font-semibold ${textColor}`}>{status}</span>
    </motion.div>
  );
}
