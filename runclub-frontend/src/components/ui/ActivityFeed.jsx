import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { UserPlus, MessageSquare, Trophy, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activityIcons = {
  joined: UserPlus,
  chat: MessageSquare,
  completed: Trophy,
  started: Zap
};

export default function ActivityFeed({ eventId }) {
  const { socket } = useSocket();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time activities
    socket.on(`event:${eventId}:activity`, (activity) => {
      setActivities((prev) => [activity, ...prev].slice(0, 10));
    });

    return () => {
      socket.off(`event:${eventId}:activity`);
    };
  }, [socket, eventId]);

  if (activities.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-900/30 p-6 text-center text-zinc-500">
        <p className="text-sm">No activity yet. Be the first to join!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || UserPlus;
        return (
          <motion.div
            key={`${activity._id}-${index}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 rounded-lg bg-zinc-900/30 p-3"
          >
            <div className="mt-1 rounded-full bg-brand-400/10 p-2">
              <Icon size={14} className="text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-100">
                <span className="font-semibold">{activity.userName}</span>
                {activity.type === "joined" && " joined the event"}
                {activity.type === "chat" && " sent a message"}
                {activity.type === "started" && " started the run"}
                {activity.type === "completed" && " finished the run"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
