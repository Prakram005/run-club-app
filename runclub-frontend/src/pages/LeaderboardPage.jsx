import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Trophy, Zap, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { GlowingText, AchievementPulse, FloatingParticles } from "../components/ui/EngagingUI";
import * as api from "../utils/api";

function rankIcon(rank) {
  if (rank === 1) {
    return <Crown size={18} className="text-amber-400" />;
  }

  if (rank === 2 || rank === 3) {
    return <Medal size={18} className={rank === 2 ? "text-zinc-300" : "text-amber-700"} />;
  }

  return <span className="w-5 text-center text-sm text-zinc-500">{rank}</span>;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("organised");

  useEffect(() => {
    api
      .getLeaderboard()
      .then((response) => {
        setBoard(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        api
          .getEvents()
          .then((response) => {
            const events = response.data || [];
            const summary = {};

            events.forEach((event) => {
              const createdBy = String(event.createdBy);
              summary[createdBy] = summary[createdBy] || {
                userId: createdBy,
                name: "Runner",
                organised: 0,
                joined: 0
              };
              summary[createdBy].organised += 1;

              event.participants?.forEach((entry) => {
                const participantId = String(typeof entry === "object" ? entry?._id : entry);
                const participantName = typeof entry === "object" ? entry?.name : "Runner";
                summary[participantId] = summary[participantId] || {
                  userId: participantId,
                  name: participantName || "Runner",
                  organised: 0,
                  joined: 0
                };
                summary[participantId].joined += 1;
              });
            });

            setBoard(Object.values(summary));
          })
          .finally(() => setLoading(false));
      });
  }, []);

  const sorted = useMemo(() => {
    return [...board].sort((left, right) =>
      tab === "organised" ? (right.organised || 0) - (left.organised || 0) : (right.joined || 0) - (left.joined || 0)
    );
  }, [board, tab]);

  const myEntry = sorted.find((entry) => String(entry.userId) === String(user?.id));
  const myRank = myEntry ? sorted.indexOf(myEntry) + 1 : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 relative">
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          🏆 Rankings
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold">
          <GlowingText color="purple">Leaderboard</GlowingText>
        </h1>
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 text-sm text-cyan-300 font-semibold"
        >
          🔥 Top organisers & most active runners
        </motion.p>
      </motion.div>

      {myRank ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex items-center gap-4 border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 p-6 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-bold text-white"
          >
            #{myRank}
          </motion.div>
          <div>
            <p className="font-bold text-white text-lg">Your Ranking</p>
            <p className="text-sm text-cyan-300">
              {tab === "organised" ? `🌟 ${myEntry?.organised || 0} events organised` : `⚡ ${myEntry?.joined || 0} events joined`}
            </p>
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-1 backdrop-blur"
      >
        {[
          { id: "organised", label: "🎯 Most Organised", icon: Trophy },
          { id: "joined", label: "⚡ Most Active", icon: Zap }
        ].map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setTab(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="card p-10 text-center border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
        >
          <p className="text-sm text-purple-300 font-semibold">Loading leaderboard...</p>
        </motion.div>
      ) : sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-10 text-center border-2 border-pink-500/30"
        >
          <motion.div animate={{ bounce: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
            <Trophy size={40} className="mx-auto text-pink-500" />
          </motion.div>
          <p className="mt-4 text-pink-300 font-semibold">No data yet</p>
          <p className="mt-1 text-xs text-zinc-400">Create and join events to appear here.</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {sorted.slice(0, 20).map((entry, index) => {
            const rank = index + 1;
            const count = tab === "organised" ? entry.organised || 0 : entry.joined || 0;
            const isMe = String(entry.userId) === String(user?.id);
            const isMedal = rank <= 3;

            return (
              <motion.div
                key={entry.userId || rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.2) }}
                whileHover={{ x: 8, scale: 1.02 }}
                className={`card flex items-center gap-4 p-5 border-2 transition cursor-pointer ${
                  isMe
                    ? "border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
                    : isMedal
                      ? "border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                      : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <motion.div
                  animate={isMedal ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-8 text-center"
                >
                  {rankIcon(rank)}
                </motion.div>
                <motion.div
                  animate={isMe ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-white ${
                    rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : rank === 2
                        ? "bg-gradient-to-br from-gray-300 to-slate-400"
                        : rank === 3
                          ? "bg-gradient-to-br from-orange-400 to-yellow-500"
                          : "bg-gradient-to-br from-cyan-500 to-blue-500"
                  }`}
                >
                  {(entry.name || "R").charAt(0).toUpperCase()}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-bold ${isMe ? "text-cyan-300" : "text-white"}`}>
                    {entry.name || "Runner"} {isMe && <span className="text-xs text-cyan-400 ml-1">(you)</span>}
                  </p>
                  <p className={`text-xs ${isMe ? "text-blue-300" : "text-zinc-500"}`}>
                    {count} {tab === "organised" ? "runs organised" : "runs joined"}
                  </p>
                </div>
                {count >= 5 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Flame size={16} className={count >= 10 ? "text-red-500" : count >= 5 ? "text-orange-500" : "text-yellow-500"} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
