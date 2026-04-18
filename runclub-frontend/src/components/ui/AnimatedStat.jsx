import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedStat({ label, value, icon: Icon, color = "cyan", delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numValue = typeof value === "string" ? parseInt(value) : value;

  useEffect(() => {
    let start = 0;
    const increment = numValue / 20;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [numValue]);

  const colorClasses = {
    cyan: "from-cyan-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-yellow-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} p-0.5 backdrop-blur-md`}
    >
      <div className="rounded-[15px] bg-zinc-950/90 backdrop-blur-sm p-6 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</p>
          {Icon && <Icon size={18} className={`text-${color}-400`} />}
        </div>
        <p className="text-4xl font-bold text-white font-display">{displayValue}</p>
      </div>
    </motion.div>
  );
}

export function StatCard({ title, value, change, icon: Icon, color = "cyan" }) {
  const colorMap = {
    cyan: { border: "border-cyan-500/30", text: "text-cyan-400", bg: "bg-cyan-500/10" },
    purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10" },
    green: { border: "border-green-500/30", text: "text-green-400", bg: "bg-green-500/10" }
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
      className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 backdrop-blur-md transition-all`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-2`}>{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${change > 0 ? "text-green-400" : "text-red-400"}`}>
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}% vs last week
            </p>
          )}
        </div>
        {Icon && <Icon size={24} className="text-opacity-40 text-white" />}
      </div>
    </motion.div>
  );
}
