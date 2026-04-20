import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function LiveParticipantCounter({ currentCount, maxCount, isLive = false }) {
  const [displayCount, setDisplayCount] = useState(currentCount);
  const isFull = currentCount >= maxCount;
  const percentage = (currentCount / maxCount) * 100;

  useEffect(() => {
    setDisplayCount(currentCount);
  }, [currentCount]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-flex h-2 w-2 rounded-full bg-red-500"
            />
          )}
          <span className="text-sm font-semibold text-zinc-200">Participants</span>
        </div>
        <motion.span
          key={displayCount}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg font-bold text-red-300"
        >
          {displayCount}/{maxCount}
        </motion.span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-zinc-900">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, type: "spring" }}
          className={`h-full ${isFull ? "bg-red-500" : "bg-gradient-to-r from-red-500 to-red-700"}`}
        />
      </div>

      {isFull && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-400"
        >
          Event is full. Join the waitlist?
        </motion.p>
      )}
    </div>
  );
}
