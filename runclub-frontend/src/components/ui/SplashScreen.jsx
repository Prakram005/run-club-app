import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Mountain, Users, Zap } from "lucide-react";

const featurePills = [
  { icon: Activity, label: "Live tracking" },
  { icon: Mountain, label: "Map pinned" },
  { icon: Users, label: "Crew ready" },
  { icon: Zap, label: "Realtime" }
];

export default function SplashScreen({ onComplete }) {
  const [showIcon, setShowIcon] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIcon(true), 280);
    const timerText = setTimeout(() => setShowText(true), 850);
    const timerComplete = setTimeout(() => onComplete(), 3600);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerText);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,26,26,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(120,0,0,0.2),transparent_35%),linear-gradient(135deg,#020202,#090909,#140505,#030303)]"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4.8, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,77,77,0.18),transparent_40%)]"
      />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 24, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute left-10 top-20 h-60 w-60 rounded-full bg-red-500/20 blur-[110px]"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, -24, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, delay: 0.8 }}
        className="absolute bottom-10 right-16 h-72 w-72 rounded-full bg-red-900/25 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {showIcon ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 16, duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="relative mx-auto h-24 w-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-800 blur-md"
                />
                <div className="absolute inset-1 flex items-center justify-center rounded-full border border-red-300/20 bg-black/90">
                  <Activity size={44} className="text-red-300" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}

        {showText ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-red-300">Run Club</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="mt-4 font-display text-6xl font-black md:text-7xl">
                <span className="text-white">RUN</span>
                <span className="mx-3 text-red-400">/</span>
                <span className="text-gradient-red">CLUB</span>
              </h1>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-5 text-xl font-semibold text-red-100 md:text-2xl">
              Move together. Build your crew.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center gap-3">
              {featurePills.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 rounded-full border border-red-400/20 bg-black/45 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur"
                  >
                    <Icon size={16} className="text-red-300" />
                    {feature.label}
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center gap-2">
              {[0, 1, 2].map((item) => (
                <motion.div
                  key={item}
                  animate={{ scale: [1, 1.45, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: item * 0.18 }}
                  className="h-3 w-3 rounded-full bg-red-400"
                />
              ))}
              <span className="ml-3 text-sm text-zinc-400">Loading your club</span>
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}
