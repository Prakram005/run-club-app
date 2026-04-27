import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton, AnimatedGradientBg, ScrollReveal } from "../ui/EnhancedAnimations";

const Hero3D = lazy(() => import("./Hero3D"));

/**
 * Modern animated hero section component
 * Perfect for landing pages, dashboards, and section headers
 */
export default function HeroSection({
  badge = "Welcome",
  title = "Keep Moving",
  subtitle = "Your crew is waiting.",
  description = "",
  ctaText = "Get Started",
  ctaVariant = "primary",
  onCTA = () => {},
  secondaryCtaText = null,
  onSecondary = () => {},
  animate = true,
  gradient = true,
  layout = "vertical", // "vertical" or "horizontal"
  enable3D = true
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      variants={animate ? containerVariants : {}}
      className="relative min-h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/30 to-black border-2 border-red-600/40 p-8 md:min-h-[460px] md:p-12 shadow-red-glow"
    >
      {enable3D && (
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      )}
      {gradient && !enable3D && <AnimatedGradientBg />}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_28%,rgba(255,36,36,0.22),transparent_34%),linear-gradient(115deg,rgba(0,0,0,0.28),rgba(0,0,0,0.78))]" />

      <div className="relative z-10">
        <div className={`flex flex-col gap-6 ${layout === "horizontal" ? "md:flex-row md:items-end md:justify-between" : ""}`}>
          <motion.div className="flex-1" variants={animate ? { hidden: {}, visible: {} } : {}}>
            {/* Badge */}
            {badge && (
              <motion.div
                variants={animate ? itemVariants : {}}
                className="mb-4"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-red-500/20 border border-red-400/30 text-xs font-bold uppercase tracking-[0.35em] text-red-400">
                  {badge}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={animate ? itemVariants : {}}
              className="font-display text-4xl md:text-5xl font-black text-gradient-white-red leading-tight"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                variants={animate ? itemVariants : {}}
                className="mt-3 text-lg text-zinc-300 font-medium"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Description */}
            {description && (
              <motion.p
                variants={animate ? itemVariants : {}}
                className="mt-4 max-w-lg text-base text-zinc-400 leading-relaxed"
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            {(ctaText || secondaryCtaText) && (
              <motion.div
                variants={animate ? itemVariants : {}}
                className="flex flex-wrap gap-3 mt-8"
              >
                {ctaText && (
                  <MagneticButton
                    onClick={onCTA}
                    className="gap-2"
                  >
                    {ctaText}
                    <ArrowRight size={18} />
                  </MagneticButton>
                )}
                {secondaryCtaText && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSecondary}
                    className="btn-ghost gap-2"
                  >
                    {secondaryCtaText}
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Side element placeholder */}
          {layout === "horizontal" && (
            <motion.div
              variants={animate ? itemVariants : {}}
              className="flex-1 h-64 rounded-2xl bg-gradient-to-br from-red-600/10 to-red-900/5 border border-red-400/10"
            />
          )}
        </div>
      </div>
    </motion.section>
  );
}

/**
 * Mini hero section for sub-pages
 */
export function MiniHero({
  title,
  description,
  icon: Icon = null,
  badge = null
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10"
          >
            <Icon size={24} className="text-red-400" />
          </motion.div>
        )}
        
        <div>
          {badge && (
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              {badge}
            </span>
          )}
          <h1 className="mt-1 font-display text-3xl font-bold text-white">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-zinc-400">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Hero section with three feature cards
 */
export function HeroWithFeatures({
  title,
  subtitle,
  features = [],
  ctaText = "Get Started",
  onCTA = () => {}
}) {
  return (
    <div className="space-y-8">
      <HeroSection
        title={title}
        subtitle={subtitle}
        ctaText={ctaText}
        onCTA={onCTA}
        layout="vertical"
      />

      {features.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={index * 0.1} preset="fade-up">
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="rounded-2xl border border-red-400/20 bg-black/45 p-6 backdrop-blur"
                >
                  {Icon && (
                    <Icon size={24} className="text-red-400 mb-3" />
                  )}
                  <h3 className="font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
