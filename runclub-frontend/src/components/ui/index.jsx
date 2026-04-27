export function Spinner({ size = 20 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-zinc-800 border-t-red-400"
      style={{ width: size, height: size }}
    />
  );
}

export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-900/80 text-zinc-300 border-white/10",
    brand: "bg-red-500/10 text-red-200 border-red-400/20",
    green: "bg-red-500/10 text-red-100 border-red-400/20"
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="card overflow-hidden p-5">
      <div className="skeleton-block h-32 rounded-[22px]" />
      <div className="mt-5 skeleton-block h-4 w-1/3 rounded-full" />
      <div className="mt-4 skeleton-block h-7 w-2/3 rounded-2xl" />
      <div className="mt-3 skeleton-block h-4 w-1/2 rounded-full" />
      <div className="mt-6 skeleton-block h-10 w-full rounded-2xl" />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card-elevated p-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
        <Icon size={30} className="text-red-300" />
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export { default as AnimatedEventStatus } from "./AnimatedEventStatus";
export { default as LiveParticipantCounter } from "./LiveParticipantCounter";
export { default as EventCountdown } from "./EventCountdown";
export { default as ActivityFeed } from "./ActivityFeed";
export { default as LiveRunTracker } from "./LiveRunTracker";
export { default as LiveLeaderboard } from "./LiveLeaderboard";
export { default as PageTransition } from "./PageTransition";
export { default as LiveNotifications } from "./LiveNotifications";
export { default as SplashScreen } from "./SplashScreen";
export { default as RouteSkeleton } from "./RouteSkeleton";
export { FloatingInput, FloatingSelect, FloatingTextarea } from "./FloatingField";
export { EngagingButton, EngagingCard, AchievementPulse, GlowingText, FloatingParticles } from "./EngagingUI";
export { 
  AnimatedCounter, 
  RippleButton, 
  ProgressRing, 
  LivePulse, 
  ScrollReveal, 
  MagneticButton,
  StaggerContainer,
  StaggerItem,
  AnimatedGradientBg
} from "./EnhancedAnimations";
