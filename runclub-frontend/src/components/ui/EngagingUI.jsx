import { motion } from "framer-motion";
import { Zap, Heart, Flame } from "lucide-react";

export function EngagingButton({ children, variant = "primary", icon: Icon, ...props }) {
  const variants = {
    primary: "border border-red-400/40 bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-red-glow-sm hover:shadow-red-glow-lg",
    secondary: "border border-white/10 bg-gradient-to-r from-zinc-900 to-red-950/80 hover:shadow-red-glow-sm",
    success: "border border-red-400/40 bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-red-glow",
    danger: "border border-red-400/40 bg-gradient-to-r from-red-700 to-red-900 hover:shadow-red-glow"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white transition duration-300 group ${variants[variant]}`}
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
          ? "border-red-400/20 bg-gradient-to-br from-red-500/15 via-red-950/20 to-black/80 shadow-red-glow-sm"
          : "border-white/10 bg-zinc-950/55 hover:border-red-400/20"
      }`}
    >
      {highlight && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-900/10 to-black/10"
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
    bronze: "from-orange-500 to-red-500",
    platinum: "from-red-400 to-red-700"
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

export function GlowingText({ children, color = "red" }) {
  const colors = {
    red: "text-red-300",
    soft: "text-red-200",
    gold: "text-amber-300",
    white: "text-white",
    cyan: "text-red-300",
    purple: "text-red-200",
    pink: "text-red-300",
    yellow: "text-amber-300"
  };

  const textShadow = {
    red: "rgba(255, 77, 77, 0.85)",
    soft: "rgba(255, 120, 120, 0.65)",
    gold: "rgba(251, 191, 36, 0.7)",
    white: "rgba(255, 255, 255, 0.5)",
    cyan: "rgba(255, 77, 77, 0.85)",
    purple: "rgba(255, 120, 120, 0.7)",
    pink: "rgba(255, 77, 77, 0.85)",
    yellow: "rgba(251, 191, 36, 0.7)"
  };

  return (
    <motion.span
      animate={{
        textShadow: [
          `0 0 8px ${textShadow[color]}`,
          `0 0 18px ${textShadow[color]}`,
          `0 0 8px ${textShadow[color]}`
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`font-bold ${colors[color]}`}
    >
      {children}
    </motion.span>
  );
}

export function FloatingParticles() {
  const palette = [
    "bg-red-500/70",
    "bg-rose-400/60",
    "bg-red-300/50",
    "bg-orange-400/55"
  ];

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute h-2 w-2 rounded-full ${palette[i % palette.length]}`}
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
