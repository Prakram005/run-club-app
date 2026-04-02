import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Rankings</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Leaderboard</h1>
        <p className="mt-2 text-sm text-zinc-400">Top organisers and most active runners.</p>
      </div>

      {myRank ? (
        <div className="card flex items-center gap-4 border-brand-400/25 bg-brand-400/5 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-400/20 text-xl font-bold text-brand-300">
            #{myRank}
          </div>
          <div>
            <p className="font-semibold text-zinc-100">Your Ranking</p>
            <p className="text-sm text-zinc-400">
              {tab === "organised" ? `${myEntry?.organised || 0} events organised` : `${myEntry?.joined || 0} events joined`}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
        {[
          { id: "organised", label: "Most Organised" },
          { id: "joined", label: "Most Active" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-xl px-4 py-2 text-sm ${
              tab === item.id ? "bg-brand-400 text-zinc-950" : "text-zinc-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-zinc-500">Loading leaderboard...</div>
      ) : sorted.length === 0 ? (
        <div className="card p-10 text-center">
          <Trophy size={36} className="mx-auto text-zinc-600" />
          <p className="mt-3 text-zinc-400">No data yet. Create and join events to appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 20).map((entry, index) => {
            const rank = index + 1;
            const count = tab === "organised" ? entry.organised || 0 : entry.joined || 0;
            const isMe = String(entry.userId) === String(user?.id);
            return (
              <div
                key={entry.userId || rank}
                className={`card flex items-center gap-4 p-4 ${isMe ? "border-brand-400/30 bg-brand-400/5" : ""}`}
              >
                <div className="w-7">{rankIcon(rank)}</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-sm font-bold text-zinc-300">
                  {(entry.name || "R").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${isMe ? "text-brand-300" : "text-zinc-200"}`}>
                    {entry.name || "Runner"} {isMe ? "(you)" : ""}
                  </p>
                  <p className="text-xs text-zinc-500">{count} {tab === "organised" ? "runs organised" : "runs joined"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
