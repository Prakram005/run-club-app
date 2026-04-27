import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Enhanced PageTransition component with multiple animation presets
 * Supports slide, fade, scale, and blur transitions
 */
export default function PageTransition({ children, preset = "fade-slide" }) {
  const presets = {
    "fade-slide": {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    "fade-blur": {
      initial: { opacity: 0, filter: "blur(8px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(8px)" },
      transition: { duration: 0.5, ease: "easeOut" }
    },
    "scale-fade": {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    "slide-left": {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -60 },
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const config = presets[preset] || presets["fade-slide"];

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated counter for stats - counts from 0 to target value
 */
export function AnimatedCounter({ 
  value = 0, 
  duration = 2.5, 
  prefix = "", 
  suffix = "",
  format = "number" 
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const steps = 60; // 60 frames for smooth animation
    const stepValue = value / steps;
    let current = 0;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      current += stepValue;
      
      if (frame >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, (duration * 1000) / steps);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

/**
 * Ripple effect button for modern click feedback
 */
export function RippleButton({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  disabled = false,
  ...props 
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.(e);
  };

  const variants = {
    primary: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-red-glow",
    ghost: "bg-black/45 border border-white/10 text-white hover:border-red-500/40",
    secondary: "bg-red-500/10 border border-red-400/20 text-red-300"
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative overflow-hidden rounded-2xl px-6 py-3 font-semibold transition-all duration-300 ${variants[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 300, 
            height: 300, 
            opacity: 0,
            left: ripple.x - 150,
            top: ripple.y - 150
          }}
          transition={{ duration: 0.6 }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * Animated progress ring for visual progress indication
 */
export function ProgressRing({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  showLabel = true,
  label = ""
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1a1a" />
            <stop offset="100%" stopColor="#ff6666" />
          </linearGradient>
        </defs>
      </svg>

      {showLabel && (
        <motion.div
          className="absolute text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
          {label && <div className="text-xs text-zinc-400 mt-1">{label}</div>}
        </motion.div>
      )}
    </div>
  );
}

/**
 * Pulsing indicator for live status
 */
export function LivePulse({ 
  label = "Live", 
  size = 8,
  color = "red"
}) {
  const colors = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500"
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size * 3, height: size * 3 }}>
        {/* Pulsing background */}
        <motion.div
          className={`absolute inset-0 rounded-full ${colors[color]} opacity-30`}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Center dot */}
        <div className={`absolute inset-1 rounded-full ${colors[color]}`} />
      </div>
      
      <motion.span
        className="text-xs font-bold text-red-400 uppercase tracking-wider"
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {label}
      </motion.span>
    </div>
  );
}

/**
 * Scroll-triggered reveal animation
 */
export function ScrollReveal({ 
  children, 
  delay = 0,
  preset = "fade-up"
}) {
  const presets = {
    "fade-up": {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 }
    },
    "fade-left": {
      initial: { opacity: 0, x: -30 },
      whileInView: { opacity: 1, x: 0 }
    },
    "scale-in": {
      initial: { opacity: 0, scale: 0.8 },
      whileInView: { opacity: 1, scale: 1 }
    },
    "rotate-in": {
      initial: { opacity: 0, rotate: -10 },
      whileInView: { opacity: 1, rotate: 0 }
    }
  };

  const config = presets[preset];

  return (
    <motion.div
      initial={config.initial}
      whileInView={config.whileInView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic button effect - button follows cursor on hover
 */
export function MagneticButton({ 
  children, 
  onClick,
  className = "",
  strength = 0.3
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!isHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setPosition({
      x: x * strength,
      y: y * strength
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={position}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`btn-primary ${className}`}
    >
      {children}
    </motion.button>
  );
}

/**
 * Staggered container for list animations
 */
export function StaggerContainer({ 
  children, 
  staggerDelay = 0.08,
  delayChildren = 0.2 
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayChildren
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item for staggered list
 */
export function StaggerItem({ children, custom = 0 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      custom={custom}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated background gradient
 */
export function AnimatedGradientBg({ 
  colors = ["from-red-950", "to-black"],
  duration = 8
}) {
  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${colors.join(" ")}`}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
      }}
      transition={{ duration, repeat: Infinity }}
      style={{ backgroundSize: "200% 200%" }}
    />
  );
}
