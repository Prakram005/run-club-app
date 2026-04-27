import { Home, CalendarDays, Map, PlusSquare, Trophy, LogOut, Flame, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LiveNotifications, PageTransition } from "../ui";
import NotificationsDropdown from "../ui/NotificationsDropdown";

const links = [
  { to: "/", label: "Dashboard", icon: Home, end: true },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/create", label: "Create", icon: PlusSquare },
  { to: "/map", label: "Map", icon: Map },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="app-shell text-white">
      <LiveNotifications />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-20 h-64 w-64 rounded-full bg-red-500/12 blur-[120px]" />
        <div className="absolute right-[-8rem] top-1/3 h-72 w-72 rounded-full bg-red-900/18 blur-[130px]" />
        <div className="absolute bottom-[-8rem] left-1/3 h-64 w-64 rounded-full bg-red-700/12 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-2xl md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-600 to-red-800 shadow-red-glow-sm">
              <Flame size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">Run Club</p>
              <p className="text-sm font-semibold text-white">{user?.name || "Runner"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="btn-ghost px-3 py-2 text-xs"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>
            <button onClick={logout} className="btn-ghost px-3 py-2 text-xs">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          <nav className="flex min-w-max gap-2">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-red-400/30 bg-red-500/15 text-white shadow-red-glow-sm"
                      : "border-white/10 bg-black/45 text-zinc-400 hover:border-red-500/30 hover:text-white"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 md:flex-row md:px-6">
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card-elevated hidden overflow-hidden border border-red-500/20 md:sticky md:top-4 md:flex md:h-[calc(100vh-2rem)] md:w-[18.5rem]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,26,26,0.14),transparent_45%)] pointer-events-none" />
          
          <div className="relative flex h-full flex-col p-6 z-10">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-600 to-red-800 shadow-red-glow">
                  <Flame size={24} className="text-white" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                  Run Club
                </p>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-white">Run loud.</h1>
              <h1 className="font-display text-3xl font-bold text-gradient-red">Finish stronger.</h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Your personal run hub with live crew energy, polished dark visuals, and zero clutter.
              </p>
            </motion.div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
              <nav className="space-y-2">
                {links.map(({ to, label, icon: Icon, end }, index) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-zinc-400 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 rounded-2xl border border-red-400/25 bg-gradient-to-r from-red-500/20 to-red-900/10 shadow-red-glow"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? "text-red-300" : ""}`}>
                          <Icon size={20} />
                        </div>
                        <span className="relative z-10">{label}</span>
                        {isActive && (
                          <div className="absolute right-3 h-2 w-2 rounded-full bg-red-400 animate-pulse-red" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-[28px] border border-red-400/20 bg-black/55 p-4 backdrop-blur-xl shadow-red-glow-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">Signed in</p>
                <p className="mt-2 truncate font-semibold text-white">{user?.name || "Runner"}</p>
                <p className="mt-1 truncate text-xs text-zinc-500">{user?.email}</p>
                <div className="mt-4 flex gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }} 
                    onClick={toggleTheme}
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className="btn-ghost flex-1 gap-2 text-xs"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }} 
                    onClick={logout} 
                    className="btn-ghost flex-1 gap-2 text-xs"
                  >
                    <LogOut size={16} />
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.aside>

        <main className="min-w-0 flex-1">
          <div className="card-elevated mb-5 hidden items-center justify-between px-5 py-4 md:flex">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-300">Now running</p>
              <p className="mt-1 text-lg font-semibold text-white">{user?.name || "Runner"}'s club dashboard</p>
            </div>

            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <button onClick={logout} className="btn-ghost gap-2 text-sm">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <PageTransition key={`${location.pathname}${location.search}`}>
              <div className="py-1 md:py-2">
                <Outlet />
              </div>
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
