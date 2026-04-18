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
    bgColor = "bg-green-500/10";
    textColor = "text-green-400";
  } else if (isInProgress) {
    status = "In Progress";
    Icon = Play;
    bgColor = "bg-blue-500/10";
    textColor = "text-blue-400";
  } else if (isStarting) {
    status = "Starting Soon";
    Icon = AlertCircle;
    bgColor = "bg-orange-500/10";
    textColor = "text-orange-400";
  } else {
    status = "Upcoming";
    Icon = Clock;
    bgColor = "bg-purple-500/10";
    textColor = "text-purple-400";
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
