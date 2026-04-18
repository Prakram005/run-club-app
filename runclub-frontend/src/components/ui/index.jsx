export function Spinner({ size = 20 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-zinc-700 border-t-brand-400"
      style={{ width: size, height: size }}
    />
  );
}

export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    brand: "bg-brand-400/10 text-brand-300 border-brand-400/20",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
      <div className="mt-4 h-7 w-2/3 animate-pulse rounded bg-zinc-800" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
      <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-zinc-800" />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card p-10 text-center">
      <Icon size={34} className="mx-auto mb-4 text-zinc-600" />
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
