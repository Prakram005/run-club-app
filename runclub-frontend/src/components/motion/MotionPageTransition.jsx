import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageTransitions } from "../../utils/motionAnimations";

/**
 * MotionPageTransition
 * Wraps pages with cinematic transition animations
 * Use this to wrap page components for smooth navigation
 */
export const MotionPageTransition = ({
  children,
  transitionType = "fadeIn",
  delay = 0,
  duration = 0.8,
  className = "",
}) => {
  const transition = pageTransitions[transitionType] || pageTransitions.fadeIn;

  return (
    <motion.div
      className={className}
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={{
        ...transition.transition,
        duration,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * PageLayout
 * Main layout wrapper with transition management
 * Place this at page level
 */
export const PageLayout = ({
  children,
  transitionType = "slideUp",
  className = "min-h-screen",
}) => {
  return (
    <AnimatePresence mode="wait">
      <MotionPageTransition
        transitionType={transitionType}
        className={className}
      >
        {children}
      </MotionPageTransition>
    </AnimatePresence>
  );
};

export default MotionPageTransition;
