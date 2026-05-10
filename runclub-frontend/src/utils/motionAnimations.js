/**
 * Premium Motion Animation Library
 * Cinematic, GPU-accelerated animations inspired by Apple, Nike, and Framer
 */

// Easing curves for premium feel
export const EASING = {
  smooth: [0.34, 1.56, 0.64, 1], // Spring-like smooth
  bounce: [0.68, -0.55, 0.265, 1.55], // Bouncy
  elastic: [0.175, 0.885, 0.32, 1.275], // Elastic
  smooth2: [0.25, 0.46, 0.45, 0.94], // Smooth standard
  snappy: [0.43, 0.13, 0.15, 0.96], // Snappy
};

// Spring physics for natural motion
export const SPRING = {
  tight: { type: "spring", damping: 25, stiffness: 200, mass: 1 },
  smooth: { type: "spring", damping: 20, stiffness: 100, mass: 1 },
  loose: { type: "spring", damping: 15, stiffness: 60, mass: 1 },
  bouncy: { type: "spring", damping: 10, stiffness: 100, mass: 0.5 },
  cinematic: { type: "spring", damping: 30, stiffness: 150, mass: 1.2 },
};

// ====== PAGE TRANSITIONS ======
export const pageTransitions = {
  // Fade + blur in effect
  fadeIn: {
    initial: { opacity: 0, filter: "blur(20px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(20px)" },
    transition: { duration: 0.8, ease: EASING.smooth2 },
  },

  // Slide up + fade
  slideUp: {
    initial: { opacity: 0, y: 60, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -60, filter: "blur(10px)" },
    transition: { duration: 0.8, ease: EASING.smooth },
  },

  // Scale + fade
  scaleIn: {
    initial: { opacity: 0, scale: 0.85, filter: "blur(20px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.85, filter: "blur(20px)" },
    transition: { duration: 0.7, ease: EASING.smooth },
  },

  // Radial reveal (center outward)
  radialReveal: {
    initial: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
    animate: { clipPath: "circle(100% at 50% 50%)", opacity: 1 },
    exit: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
    transition: { duration: 0.8, ease: EASING.smooth2 },
  },

  // Horizontal slide
  slideRight: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.6, ease: EASING.smooth },
  },
};

// ====== HERO SECTION ======
export const heroAnimations = {
  // Main title animation
  titleGlitch: {
    animate: (i) => ({
      y: [0, -10, 0],
      opacity: [1, 0.8, 1],
    }),
    transition: {
      duration: 0.8,
      delay: i * 0.05,
      ease: EASING.smooth,
    },
  },

  // Floating elements
  float: {
    animate: {
      y: [0, -30, 0],
      x: [0, 10, 0],
    },
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },

  // Glow pulse effect
  glowPulse: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(0, 255, 136, 0.3)",
        "0 0 40px rgba(0, 255, 136, 0.6)",
        "0 0 20px rgba(0, 255, 136, 0.3)",
      ],
    },
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },

  // Rotating border glow
  borderRotate: {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    },
    transition: {
      duration: 5,
      ease: "linear",
      repeat: Infinity,
    },
  },

  // Text reveal stagger
  textRevealStagger: (index) => ({
    initial: { opacity: 0, y: 20, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: 0.8,
      delay: index * 0.1,
      ease: EASING.smooth2,
    },
  }),
};

// ====== SCROLL ANIMATIONS ======
export const scrollAnimations = {
  // Fade in on scroll
  fadeInScroll: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.8 },
    viewport: { once: false, amount: 0.3 },
  },

  // Slide in on scroll
  slideInScroll: {
    initial: { opacity: 0, y: 100, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, ease: EASING.smooth },
    viewport: { once: false, amount: 0.3 },
  },

  // Scale in on scroll
  scaleInScroll: {
    initial: { opacity: 0, scale: 0.8, filter: "blur(20px)" },
    whileInView: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { duration: 0.8, ease: EASING.smooth2 },
    viewport: { once: false, amount: 0.3 },
  },

  // Rotate in on scroll
  rotateInScroll: {
    initial: { opacity: 0, rotate: -20, scale: 0.8 },
    whileInView: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.8, ease: EASING.smooth },
    viewport: { once: false, amount: 0.3 },
  },
};

// ====== CARD & ELEMENT ANIMATIONS ======
export const cardAnimations = {
  // Hover lift effect
  liftHover: {
    whileHover: {
      y: -10,
      boxShadow: "0 20px 60px rgba(0, 255, 136, 0.3)",
    },
    transition: { type: "spring", ...SPRING.tight },
  },

  // 3D tilt effect
  tiltHover: {
    whileHover: {
      rotateX: 5,
      rotateY: 5,
    },
    style: { perspective: "1000px" },
    transition: SPRING.smooth,
  },

  // Scale & glow hover
  scaleGlowHover: {
    whileHover: {
      scale: 1.05,
      boxShadow: "0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)",
    },
    transition: SPRING.tight,
  },

  // Border glow hover
  borderGlowHover: {
    whileHover: {
      boxShadow: "inset 0 0 20px rgba(0, 255, 136, 0.3)",
    },
    transition: { duration: 0.3 },
  },

  // Staggered container
  containerStagger: {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: false, amount: 0.2 },
  },

  itemStagger: {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: EASING.smooth2,
      },
    }),
  },
};

// ====== BUTTON ANIMATIONS ======
export const buttonAnimations = {
  // Magnetic cursor effect
  magneticHover: {
    whileHover: {
      scale: 1.1,
      boxShadow: "0 0 40px rgba(0, 255, 136, 0.6)",
    },
    whileTap: { scale: 0.95 },
    transition: SPRING.tight,
  },

  // Ripple effect
  rippleClick: {
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
  },

  // Glow pulse on hover
  glowPulseHover: {
    whileHover: {
      boxShadow: [
        "0 0 20px rgba(0, 255, 136, 0.3)",
        "0 0 40px rgba(0, 255, 136, 0.6)",
        "0 0 20px rgba(0, 255, 136, 0.3)",
      ],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

// ====== MOTION VARIANTS HELPERS ======
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.smooth2,
    },
  },
};

// ====== UTILITY FUNCTIONS ======
export const createStaggerDelay = (index, baseDelay = 0, increment = 0.1) => {
  return baseDelay + index * increment;
};

export const createScrollTrigger = (amount = 0.3, once = false) => ({
  whileInView: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 100 },
  viewport: { once, amount },
});

// ====== OVERLAY & EFFECT ANIMATIONS ======
export const effectAnimations = {
  // Cinematic vignette fade
  vignetteEffect: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 },
  },

  // Motion blur effect simulation
  motionBlur: {
    animate: {
      filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
    },
    transition: {
      duration: 0.5,
      ease: EASING.smooth2,
    },
  },

  // Shimmer effect
  shimmer: {
    animate: {
      backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
    },
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// ====== PARTICLE & FLOATING ANIMATIONS ======
export const particleAnimations = {
  float: (delay = 0) => ({
    animate: {
      y: [0, -30, 0],
      x: [0, 20, 0],
      rotate: [0, 360, 0],
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 4 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),

  pulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  orbit: (radius = 100, duration = 10) => ({
    animate: {
      x: [0, radius, 0, -radius, 0],
      y: [0, 0, radius, 0, -radius],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: "linear",
    },
  }),
};

export default {
  EASING,
  SPRING,
  pageTransitions,
  heroAnimations,
  scrollAnimations,
  cardAnimations,
  buttonAnimations,
  containerVariants,
  itemVariants,
  effectAnimations,
  particleAnimations,
  createStaggerDelay,
  createScrollTrigger,
};
