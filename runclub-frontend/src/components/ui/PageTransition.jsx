import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.985,
    filter: "blur(10px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.992,
    filter: "blur(6px)",
    transition: {
      duration: 0.24,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export default function PageTransition({ children, delay = 0 }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ ...pageVariants.animate.transition, delay }}
    >
      {children}
    </motion.div>
  );
}
