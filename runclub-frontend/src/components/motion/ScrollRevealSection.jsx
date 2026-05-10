import React from "react";
import { motion } from "framer-motion";
import {
  scrollAnimations,
  containerVariants,
  itemVariants,
  EASING,
} from "../../utils/motionAnimations";

/**
 * ScrollRevealSection
 * Reveals content with animations when it enters viewport
 */
export const ScrollRevealSection = ({
  children,
  type = "slideInScroll",
  delay = 0,
  className = "",
  stagger = false,
  staggerDelay = 0.1,
}) => {
  const animation = scrollAnimations[type] || scrollAnimations.fadeInScroll;

  return (
    <motion.div
      className={className}
      {...animation}
      transition={{
        ...animation.transition,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollRevealContainer
 * Container for staggered reveal animations
 */
export const ScrollRevealContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
  delayChildren = 0.2,
  amount = 0.3,
}) => {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount }}
      transition={{
        staggerChildren: staggerDelay,
        delayChildren,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollRevealItem
 * Individual item for staggered animations
 */
export const ScrollRevealItem = ({
  children,
  className = "",
  index = 0,
  duration = 0.5,
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: EASING.smooth2,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ParallaxScrollSection
 * Creates parallax effect during scroll
 */
export const ParallaxScrollSection = ({
  children,
  offset = 50,
  className = "",
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: offset }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{
        type: "tween",
        ease: "easeOut",
        duration: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * StickySectionTransition
 * Sticky section that reveals on scroll
 */
export const StickySectionTransition = ({
  children,
  threshold = 0.3,
  className = "",
}) => {
  return (
    <motion.section
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: threshold }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.section>
  );
};

export default ScrollRevealSection;
