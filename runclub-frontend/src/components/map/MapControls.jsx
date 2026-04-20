import { motion } from "framer-motion";
import { Eye, EyeOff, Volume2, VolumeX, Map, Zap } from "lucide-react";

export default function MapControls({
  onToggleLiveTracking,
  onToggleHeatmap,
  onToggleAnimations,
  onToggleSound,
  liveTracking = true,
  showHeatmap = false,
  animationsEnabled = true,
  soundEnabled = false
}) {
  const ToggleButton = ({ icon: Icon, label, isActive, onClick }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition ${
        isActive
          ? "border border-red-400/30 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
          : "border border-white/10 bg-zinc-950/80 text-zinc-300 hover:border-red-500/30 hover:bg-zinc-900"
      }`}
    >
      <Icon size={16} />
      <span className="text-sm font-semibold">{label}</span>
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-white"
        />
      )}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-black/55 p-4 backdrop-blur"
    >
      <ToggleButton
        icon={liveTracking ? Eye : EyeOff}
        label="Live Tracking"
        isActive={liveTracking}
        onClick={() => onToggleLiveTracking?.(!liveTracking)}
      />
      <ToggleButton
        icon={Map}
        label="Heat Map"
        isActive={showHeatmap}
        onClick={() => onToggleHeatmap?.(!showHeatmap)}
      />
      <ToggleButton
        icon={Zap}
        label="Animations"
        isActive={animationsEnabled}
        onClick={() => onToggleAnimations?.(!animationsEnabled)}
      />
      <ToggleButton
        icon={soundEnabled ? Volume2 : VolumeX}
        label="Sound"
        isActive={soundEnabled}
        onClick={() => onToggleSound?.(!soundEnabled)}
      />
    </motion.div>
  );
}
