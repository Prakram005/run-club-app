import { motion } from "framer-motion";
import { MapPin, Radio, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function LiveRunMarker({ event, isActive = false, isSelected = false }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPulse((prev) => (prev + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-full ${
          isActive ? "bg-red-500" : "bg-brand-400"
        } opacity-30`}
        style={{ width: "30px", height: "30px", marginLeft: "-15px", marginTop: "-15px" }}
      />
      <div
        className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition transform hover:scale-125 ${
          isActive
            ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50"
            : isSelected
              ? "bg-gradient-to-br from-brand-400 to-brand-500 shadow-lg shadow-brand-400/50"
              : "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50"
        }`}
      >
        <MapPin size={16} />
      </div>
    </motion.div>
  );
}

export function EventMarkerInfoCard({ event, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg p-3 min-w-[200px] border ${
        isActive
          ? "border-red-500/50 bg-red-500/10"
          : "border-brand-400/50 bg-brand-400/10"
      }`}
    >
      <p className="font-semibold text-sm text-white">{event.title}</p>

      <div className="mt-2 space-y-1.5 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-cyan-400" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-yellow-400" />
          <span>{format(new Date(event.date), "h:mm a")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} className="text-blue-400" />
          <span>{event.participants?.length || 0} / {event.maxParticipants || 20}</span>
        </div>
        {isActive && (
          <div className="mt-2 flex items-center gap-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="text-red-400 font-semibold">LIVE</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
