import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { heroAnimations, EASING, SPRING, effectAnimations } from "../../utils/motionAnimations";

export const CinematicHeroSection = ({
  title = "Run. Connect. Inspire.",
  subtitle = "Join the world's most immersive running community",
  backgroundImage = null,
  cta = "Get Started",
  onCtaClick = () => {},
  gradient = true,
  animated = true,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: EASING.smooth2 },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay: 0.3, ease: EASING.smooth2 },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay: 0.6, ease: EASING.smooth },
    },
  };

  return (
    <motion.section
      className="section-hero relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background with floating particles */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: backgroundImage
            ? `url(${backgroundImage})`
            : "linear-gradient(135deg, #0a0a0a 0%, #1a0f2e 50%, #0a0a0a 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "tween", ease: "easeOut" }}
      >
        {/* Gradient overlay */}
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        )}

        {/* Floating neon orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Glowing accent line */}
        <motion.div
          className="mb-8 h-1 w-24 mx-auto rounded-full"
          style={{
            background: "linear-gradient(90deg, #00ff88, #00d4ff, #ff00ff)",
            boxShadow:
              "0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)",
          }}
          animate={{
            scaleX: [0.5, 1, 0.5],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-gradient-neon">{title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          {subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.button
          className="btn btn-primary text-lg px-12 py-4 relative overflow-hidden group"
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.08,
            boxShadow:
              "0 0 40px rgba(0, 255, 136, 0.6), 0 0 80px rgba(0, 212, 255, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onCtaClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.span
            animate={{
              opacity: isHovering ? 0 : 1,
              x: isHovering ? 20 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute" }}
          >
            {cta}
          </motion.span>
          <motion.span
            animate={{
              opacity: isHovering ? 1 : 0,
              x: isHovering ? 0 : -20,
            }}
            transition={{ duration: 0.3 }}
          >
            {cta} →
          </motion.span>
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-10 border-2 border-neon-green rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-neon-green rounded-full"
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 z-5 pointer-events-none bg-gradient-to-br from-black/0 via-transparent to-black/40" />
    </motion.section>
  );
};

export default CinematicHeroSection;
