export default function RouteSkeleton({
  title = "Loading your run club",
  description = "Syncing live activity, events, and profile details."
}) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="card-elevated overflow-hidden p-6 md:p-8">
        <div className="skeleton-block h-4 w-32 rounded-full" />
        <div className="mt-5 grid gap-3">
          <div className="skeleton-block h-12 w-full rounded-2xl md:w-2/3" />
          <div className="skeleton-block h-4 w-full rounded-full md:w-1/2" />
        </div>
        <p className="mt-5 text-sm text-zinc-400">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card p-5">
            <div className="skeleton-block h-4 w-20 rounded-full" />
            <div className="mt-4 skeleton-block h-10 w-24 rounded-2xl" />
            <div className="mt-6 skeleton-block h-3 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="card p-6 md:p-8">
        <div className="skeleton-block h-5 w-44 rounded-full" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-black/45 p-5">
              <div className="skeleton-block h-3 w-24 rounded-full" />
              <div className="mt-4 skeleton-block h-7 w-2/3 rounded-2xl" />
              <div className="mt-5 skeleton-block h-3 w-full rounded-full" />
              <div className="mt-3 skeleton-block h-3 w-4/5 rounded-full" />
              <div className="mt-6 skeleton-block h-11 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-400/70">{title}</p>
    </div>
  );
}
