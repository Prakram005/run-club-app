import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Trophy, Zap, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { GlowingText, FloatingParticles } from "../components/ui/EngagingUI";
import { RouteSkeleton } from "../components/ui";
import * as api from "../utils/api";

function rankIcon(rank) {
  if (rank === 1) {
    return <Crown size={18} className="text-amber-300" />;
  }

  if (rank === 2 || rank === 3) {
    return <Medal size={18} className={rank === 2 ? "text-zinc-200" : "text-amber-700"} />;
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

  if (loading) {
    return <RouteSkeleton title="Loading leaderboard" description="Sorting club stats and active runner rankings." />;
  }

  return (
    <div className="relative mx-auto max-w-4xl space-y-6">
      <FloatingParticles />

      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-7 md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-red-300">Leaderboard</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">
          <GlowingText color="red">Club rankings</GlowingText>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Track the most active runners and top organizers in leaderboard view.
        </p>
      </motion.section>

      {myRank ? (
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex items-center gap-4 border border-red-400/20 bg-black/45 p-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-red-400/30 bg-gradient-to-br from-red-600 to-red-800 text-xl font-bold text-white shadow-red-glow-sm">
            #{myRank}
          </div>
          <div>
            <p className="text-lg font-bold text-white">Your ranking</p>
            <p className="text-sm text-red-200">
              {tab === "organised"
                ? `${myEntry?.organised || 0} runs organized`
                : `${myEntry?.joined || 0} runs joined`}
            </p>
          </div>
        </motion.section>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 rounded-[24px] border border-white/10 bg-black/45 p-1.5 backdrop-blur"
      >
        {[
          { id: "organised", label: "Top organizers", icon: Trophy },
          { id: "joined", label: "Most active", icon: Zap }
        ].map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setTab(item.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.div>

      {sorted.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
            <Trophy size={34} className="text-red-300" />
          </div>
          <p className="mt-5 text-lg font-semibold text-white">No leaderboard data yet</p>
          <p className="mt-2 text-sm text-zinc-400">Create and join events to appear here.</p>
        </motion.div>
      ) : (
        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {sorted.slice(0, 20).map((entry, index) => {
            const rank = index + 1;
            const count = tab === "organised" ? entry.organised || 0 : entry.joined || 0;
            const isMe = String(entry.userId) === String(user?.id);
            const isMedal = rank <= 3;

            return (
              <motion.div
                key={entry.userId || rank}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.2) }}
                whileHover={{ x: 6, scale: 1.01 }}
                className={`card flex items-center gap-4 p-5 transition ${
                  isMe
                    ? "border-red-400/25 bg-red-500/10"
                    : isMedal
                      ? "border-red-400/20 bg-black/55"
                      : "border-white/10 bg-black/40"
                }`}
              >
                <div className="w-8 text-center">{rankIcon(rank)}</div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[18px] font-bold text-white ${
                    rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : rank === 2
                        ? "bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950"
                        : rank === 3
                          ? "bg-gradient-to-br from-amber-700 to-amber-500"
                          : "bg-gradient-to-br from-red-600 to-red-800"
                  }`}
                >
                  {(entry.name || "R").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-bold ${isMe ? "text-red-200" : "text-white"}`}>
                    {entry.name || "Runner"} {isMe ? <span className="ml-1 text-xs text-red-300">(you)</span> : null}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {count} {tab === "organised" ? "runs organized" : "runs joined"}
                  </p>
                </div>
                {count >= 5 ? (
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Flame size={16} className={count >= 10 ? "text-red-400" : "text-amber-400"} />
                  </motion.div>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
