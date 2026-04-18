import { motion } from "framer-motion";
import { Trophy, Flame, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function LiveLeaderboard({ leaderboard = [], variant = "compact" }) {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-900/30 p-6 text-center text-zinc-500">
        <p className="text-sm">No leaderboard data yet</p>
      </div>
    );
  }

  const getMedalIcon = (position) => {
    if (position === 1) return <Trophy size={16} className="text-yellow-500" />;
    if (position === 2) return <Trophy size={16} className="text-gray-400" />;
    if (position === 3) return <Trophy size={16} className="text-amber-600" />;
    return null;
  };

  const getStreakIcon = (streak) => {
    if (streak >= 10) return <Flame size={14} className="text-red-500" />;
    if (streak >= 5) return <Zap size={14} className="text-yellow-500" />;
    return null;
  };

  const displayItems = variant === "compact" ? leaderboard.slice(0, 5) : leaderboard;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {displayItems.map((entry, index) => (
        <motion.div
          key={entry._id || index}
          variants={itemVariants}
          className={`flex items-center justify-between rounded-lg p-3 ${
            index === 0
              ? "bg-yellow-500/10 border border-yellow-500/30"
              : index === 1
                ? "bg-gray-500/10 border border-gray-500/30"
                : index === 2
                  ? "bg-amber-600/10 border border-amber-600/30"
                  : "bg-zinc-900/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 font-semibold text-zinc-400">
              {getMedalIcon(index + 1) || index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-zinc-100">{entry.name}</p>
              <p className="text-xs text-zinc-500">{entry.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStreakIcon(entry.streak) && (
              <div className="flex items-center gap-1">
                {getStreakIcon(entry.streak)}
                <span className="text-xs font-semibold text-zinc-400">{entry.streak}</span>
              </div>
            )}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-right"
            >
              <p className="text-lg font-bold text-brand-400">{entry.score || 0}</p>
              <p className="text-xs text-zinc-500">points</p>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
