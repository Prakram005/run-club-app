import React from "react";
import { motion } from "framer-motion";
import { buttonAnimations, cardAnimations, SPRING } from "../../utils/motionAnimations";

/**
 * PremiumCard
 * Glassmorphic card with hover effects and glow
 */
export const PremiumCard = ({
  children,
  className = "",
  onClick = null,
  glowColor = "green",
  hoverable = true,
  animated = true,
}) => {
  const glowClasses = {
    green: "hover:shadow-neon-glow",
    blue: "hover:shadow-neon-blue",
    pink: "hover:shadow-neon-pink",
  };

  return (
    <motion.div
      className={`card rounded-2xl p-6 transition-all duration-300 cursor-pointer ${glowClasses[glowColor]} ${className}`}
      whileHover={
        hoverable && animated
          ? {
              y: -8,
              boxShadow: "0 20px 60px rgba(0, 255, 136, 0.2)",
            }
          : {}
      }
      whileTap={hoverable && animated ? { scale: 0.98 } : {}}
      onClick={onClick}
      transition={SPRING.tight}
    >
      {children}
    </motion.div>
  );
};

/**
 * NeonButton
 * Premium button with neon glow and hover effects
 */
export const NeonButton = ({
  children,
  onClick = () => {},
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
  };

  return (
    <motion.button
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      {...buttonAnimations.magneticHover}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

/**
 * GlowingText
 * Text with animated glow effect
 */
export const GlowingText = ({
  children,
  color = "green",
  size = "lg",
  className = "",
  animate = true,
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-2xl",
    xl: "text-4xl",
    "2xl": "text-6xl",
  };

  const colorClasses = {
    green: "text-neon-green",
    blue: "text-neon-blue",
    pink: "text-neon-pink",
  };

  const glowShadows = {
    green: "0 0 20px rgba(0, 255, 136, 0.5)",
    blue: "0 0 20px rgba(0, 212, 255, 0.5)",
    pink: "0 0 20px rgba(255, 0, 255, 0.5)",
  };

  return (
    <motion.span
      className={`font-bold ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={
        animate && {
          textShadow: [
            glowShadows[color],
            `0 0 40px ${color === "green" ? "rgba(0, 255, 136, 0.8)" : color === "blue" ? "rgba(0, 212, 255, 0.8)" : "rgba(255, 0, 255, 0.8)"}`,
            glowShadows[color],
          ],
        }
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
};

/**
 * AnimatedCounter
 * Smoothly animated number counter
 */
export const AnimatedCounter = ({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTime = Date.now();

    const updateCounter = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(value * progress * (10 ** decimals)) / (10 ** decimals);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  }, [value, duration, decimals]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/**
 * PulsingDot
 * Animated pulsing indicator
 */
export const PulsingDot = ({
  color = "green",
  size = "md",
  className = "",
}) => {
  const colorClasses = {
    green: "bg-neon-green shadow-neon-glow",
    blue: "bg-neon-blue shadow-neon-blue",
    pink: "bg-neon-pink shadow-neon-pink",
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <motion.div
      className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [1, 0.6, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

/**
 * FloatingParticles
 * Background particle effects
 */
export const FloatingParticles = ({ count = 20, className = "" }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon-green rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -Math.random() * 100, -150],
            opacity: [0, 1, 0],
            x: Math.random() * 100 - 50,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

/**
 * GradientBorder
 * Animated gradient border effect
 */
export const GradientBorder = ({
  children,
  className = "",
  borderWidth = 2,
  animated = true,
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: animated
          ? "linear-gradient(90deg, #00ff88, #00d4ff, #ff00ff, #00ff88)"
          : "transparent",
        backgroundSize: "300% 100%",
        padding: borderWidth,
        borderRadius: "16px",
      }}
      animate={
        animated && {
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
        }
      }
      transition={{
        duration: 5,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <div className="bg-black rounded-[14px]">{children}</div>
    </motion.div>
  );
};

/**
 * StatDisplay
 * Beautiful stat card with icon and animated counter
 */
export const StatDisplay = ({
  icon,
  label,
  value,
  unit = "",
  color = "green",
  className = "",
}) => {
  const colorClasses = {
    green: "text-neon-green",
    blue: "text-neon-blue",
    pink: "text-neon-pink",
  };

  return (
    <PremiumCard className={`text-center ${className}`} glowColor={color}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl mb-3"
      >
        {icon}
      </motion.div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>
        <AnimatedCounter value={value} duration={2} suffix={unit} />
      </div>
    </PremiumCard>
  );
};

export default {
  PremiumCard,
  NeonButton,
  GlowingText,
  AnimatedCounter,
  PulsingDot,
  FloatingParticles,
  GradientBorder,
  StatDisplay,
};
