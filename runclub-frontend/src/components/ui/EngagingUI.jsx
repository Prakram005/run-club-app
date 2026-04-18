import { motion } from "framer-motion";
import { Zap, Heart, Flame } from "lucide-react";

export function EngagingButton({ children, variant = "primary", icon: Icon, ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/50",
    secondary:
      "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:shadow-lg hover:shadow-pink-500/50",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/50",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:shadow-red-500/50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-6 py-3 rounded-xl font-semibold text-white transition overflow-hidden group ${variants[variant]}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      <div className="relative flex items-center justify-center gap-2">
        {Icon && <Icon size={18} />}
        {children}
      </div>
    </motion.button>
  );
}

export function EngagingCard({ children, highlight = false, animated = true }) {
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      whileHover={animated ? { y: -8, scale: 1.02 } : {}}
      className={`relative rounded-2xl border backdrop-blur transition overflow-hidden group ${
        highlight
          ? "border-transparent bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 shadow-lg shadow-cyan-500/20"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
    >
      {highlight && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function AchievementPulse({ children, level = "bronze" }) {
  const colors = {
    gold: "from-yellow-400 to-orange-500",
    silver: "from-gray-300 to-slate-400",
    bronze: "from-orange-400 to-yellow-500",
    platinum: "from-cyan-400 to-blue-500"
  };

  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`relative px-4 py-2 rounded-full bg-gradient-to-r ${colors[level]} text-white font-bold text-sm shadow-lg`}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-white/30"
        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="relative flex items-center gap-2">
        <Zap size={14} />
        {children}
      </div>
    </motion.div>
  );
}

export function GlowingText({ children, color = "cyan" }) {
  const colors = {
    cyan: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    purple: "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    pink: "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]",
    yellow: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
  };

  return (
    <motion.span
      animate={{ textShadow: ["0 0 8px rgba(34,211,238,0.4)", "0 0 20px rgba(34,211,238,0.8)", "0 0 8px rgba(34,211,238,0.4)"] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`font-bold ${colors[color]}`}
    >
      {children}
    </motion.span>
  );
}

export function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            ["bg-cyan-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"][i % 4]
          }`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight,
            opacity: 0
          }}
          animate={{
            y: -window.innerHeight,
            opacity: [0, 1, 0],
            x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
