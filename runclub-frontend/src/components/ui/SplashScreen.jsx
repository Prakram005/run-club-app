import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Mountain, Users, Zap } from "lucide-react";

export default function SplashScreen({ onComplete }) {
  const [showIcon, setShowIcon] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIcon(true), 300);
    const timerText = setTimeout(() => setShowText(true), 1000);
    const timerComplete = setTimeout(() => onComplete(), 4500);

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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-zinc-950 via-blue-950 to-purple-950 flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"
      />

      {/* Floating Orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
      />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Icon Animation */}
        {showIcon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, linear: true }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur"
                />
                <div className="absolute inset-1 bg-zinc-950 rounded-full flex items-center justify-center">
                  <Activity size={48} className="text-cyan-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Text Animation */}
        {showText && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <h1 className="text-6xl md:text-7xl font-display font-black mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RUN
                </span>
                <span className="text-white mx-3">•</span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  CLUB
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-cyan-300 font-semibold mb-8"
            >
              Move Together. Build Your Crew.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {[
                { icon: Activity, label: "Live Tracking", color: "from-cyan-500 to-blue-500" },
                { icon: Mountain, label: "Map View", color: "from-blue-500 to-purple-500" },
                { icon: Users, label: "Community", color: "from-purple-500 to-pink-500" },
                { icon: Zap, label: "Real-time", color: "from-pink-500 to-red-500" }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} text-white font-semibold text-sm shadow-lg`}
                  >
                    <Icon size={16} />
                    {feature.label}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-cyan-400"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-3 h-3 rounded-full bg-purple-400"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-3 h-3 rounded-full bg-pink-400"
              />
              <span className="text-zinc-400 ml-2 text-sm">Loading...</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
