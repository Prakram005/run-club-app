import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Zap, Map } from "lucide-react";

export default function LiveRunTracker({ eventId, isActive = false }) {
  const [runStats, setRunStats] = useState({
    distance: 0,
    pace: "0:00",
    duration: "00:00:00",
    calories: 0,
    participants: 0
  });

  useEffect(() => {
    if (!isActive) return;

    // Simulate live run updates
    const interval = setInterval(() => {
      setRunStats((prev) => ({
        ...prev,
        distance: (Math.random() * 10 + 0.1).toFixed(2),
        pace: `${Math.floor(Math.random() * 5) + 7}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        duration: `00:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        calories: Math.floor(Math.random() * 200 + 100),
        participants: Math.floor(Math.random() * 15 + 5)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) {
    return (
      <div className="rounded-lg bg-zinc-900/30 p-6 text-center text-zinc-500">
        <p className="text-sm">Run stats will appear when the event starts</p>
      </div>
    );
  }

  const StatItem = ({ icon: Icon, label, value, unit }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-2 rounded-lg bg-zinc-900/50 p-4"
    >
      <Icon size={18} className="text-brand-400" />
      <motion.span key={value} className="text-2xl font-bold text-zinc-100">
        {value}
      </motion.span>
      <span className="text-xs text-zinc-500">
        {label} {unit && <span className="text-zinc-600">{unit}</span>}
      </span>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-lg border border-brand-400/20 bg-brand-400/5 p-6"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-3 w-3 rounded-full bg-green-500"
        />
        <span className="text-sm font-semibold text-green-400">Run in Progress</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem icon={Map} label="Distance" value={runStats.distance} unit="km" />
        <StatItem icon={Zap} label="Pace" value={runStats.pace} unit="/km" />
        <StatItem icon={Activity} label="Duration" value={runStats.duration} />
        <StatItem icon={Activity} label="Calories" value={runStats.calories} />
      </div>

      <div className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900/50 p-3">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-2 w-2 rounded-full bg-blue-400"
        />
        <span className="text-sm text-blue-400">{runStats.participants} runners active</span>
      </div>
    </motion.div>
  );
}
