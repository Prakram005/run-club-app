import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SPRING, EASING } from "../../utils/motionAnimations";

/**
 * RunTrackingVisualization
 * Displays running metrics with animated routes and cinematic styling
 */
export const RunTrackingVisualization = ({
  distance = 10.73,
  pace = "3:59",
  time = "42:44",
  calories = 163,
  elevation = 120,
  animated = true,
}) => {
  const [counters, setCounters] = useState({
    distance: 0,
    calories: 0,
    elevation: 0,
  });

  useEffect(() => {
    if (!animated) return;

    const targets = {
      distance,
      calories,
      elevation,
    };

    const duration = 2; // seconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      setCounters({
        distance: (targets.distance * progress).toFixed(2),
        calories: Math.floor(targets.calories * progress),
        elevation: Math.floor(targets.elevation * progress),
      });

      if (progress === 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [distance, calories, elevation, animated]);

  return (
    <div className="relative w-full min-h-96 rounded-2xl overflow-hidden border border-neon-glow bg-gradient-to-br from-black/40 to-black/20">
      {/* Animated background grid */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated running path */}
        <motion.path
          d="M 50 150 Q 100 80, 150 120 T 250 100 Q 300 95, 350 150"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          strokeDasharray="300"
          initial={{ strokeDashoffset: 300 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2, ease: EASING.smooth2 }}
        />

        {/* Start marker */}
        <motion.circle
          cx="50"
          cy="150"
          r="6"
          fill="#00ff88"
          opacity="0.8"
          animate={{
            r: [6, 8, 6],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          filter="url(#glow)"
        />

        {/* End marker */}
        <motion.circle
          cx="350"
          cy="150"
          r="8"
          fill="#00d4ff"
          animate={{
            r: [8, 12, 8],
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          filter="url(#glow)"
        />
      </motion.svg>

      {/* Content overlay */}
      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        {/* Header */}
        <div>
          <motion.h3
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gradient-neon">Live Run Session</span>
          </motion.h3>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Wednesday Morning Run
          </motion.p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Distance */}
          <MetricCard
            label="Distance"
            value={animated ? counters.distance : distance.toFixed(2)}
            unit="km"
            icon="📍"
            delay={0.4}
            color="neon-green"
          />

          {/* Pace */}
          <MetricCard
            label="Pace"
            value={pace}
            unit="/km"
            icon="⚡"
            delay={0.5}
            color="neon-blue"
          />

          {/* Time */}
          <MetricCard
            label="Time"
            value={time}
            unit=""
            icon="⏱️"
            delay={0.6}
            color="neon-pink"
          />

          {/* Elevation */}
          <MetricCard
            label="Elevation"
            value={animated ? counters.elevation : elevation}
            unit="m"
            icon="📈"
            delay={0.7}
            color="neon-green"
          />
        </div>

        {/* Calories burned */}
        <motion.div
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-neon-pink/10 to-neon-blue/10 border border-neon-pink/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, ...SPRING.smooth }}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Calories Burned</span>
            <motion.span
              className="text-2xl font-bold text-neon-pink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {animated ? counters.calories : calories} kcal
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            "inset 0 0 20px rgba(0, 255, 136, 0.1)",
            "inset 0 0 40px rgba(0, 255, 136, 0.2)",
            "inset 0 0 20px rgba(0, 255, 136, 0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

/**
 * MetricCard
 * Individual metric display card
 */
const MetricCard = ({ label, value, unit, icon, delay, color }) => {
  const colorClasses = {
    "neon-green": "text-neon-green shadow-neon-glow",
    "neon-blue": "text-neon-blue shadow-neon-blue",
    "neon-pink": "text-neon-pink shadow-neon-pink",
  };

  return (
    <motion.div
      className="p-3 rounded-lg bg-black/30 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: EASING.smooth2 }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 20px rgba(0, 255, 136, 0.2)`,
      }}
    >
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
        <span>{icon}</span>
        {label}
      </div>
      <div className={`text-lg font-bold ${colorClasses[color]}`}>
        {value}
        <span className="text-xs text-gray-400 ml-1">{unit}</span>
      </div>
    </motion.div>
  );
};

/**
 * LiveRunTracker
 * Real-time run tracking with animated stats
 */
export const LiveRunTracker = ({
  isRunning = false,
  runData = {},
  onStopRun = () => {},
}) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <RunTrackingVisualization
        distance={runData.distance || 0}
        pace={runData.pace || "0:00"}
        time={runData.time || "00:00"}
        calories={runData.calories || 0}
        elevation={runData.elevation || 0}
      />

      {isRunning && (
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={onStopRun}
            className="btn btn-danger px-8"
          >
            Stop Run
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RunTrackingVisualization;
