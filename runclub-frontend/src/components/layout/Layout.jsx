import { Home, CalendarDays, Map, PlusSquare, Trophy, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: Home, end: true },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/create", label: "Create", icon: PlusSquare },
  { to: "/map", label: "Map", icon: Map },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy }
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 md:flex-row md:px-6">
        <aside className="card md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-72">
          <div className="flex h-full flex-col p-5">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Run Club</p>
              <h1 className="mt-2 font-display text-3xl font-bold">Move Together</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Manage your runs, join the crew, and keep the momentum going.
              </p>
            </div>

            <nav className="space-y-2">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-brand-400 text-zinc-950"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">Signed in as</p>
              <p className="mt-1 font-semibold text-zinc-100">{user?.name || "Runner"}</p>
              <p className="truncate text-sm text-zinc-400">{user?.email}</p>
              <button onClick={logout} className="btn-ghost mt-4 w-full gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="py-2 md:py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
