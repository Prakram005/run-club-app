import { Home, CalendarDays, Map, PlusSquare, Trophy, LogOut, Flame } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { LiveNotifications } from "../ui";
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

  return (
    <div className="min-h-screen bg-black text-white">
      <LiveNotifications />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 md:flex-row md:px-6">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="card-elevated md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-80 overflow-hidden border border-red-600/30"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black pointer-events-none" />
          
          <div className="relative flex h-full flex-col p-6 z-10">
            {/* Logo Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-red-800 shadow-red-glow">
                  <Flame size={24} className="text-white" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Run Club
                </p>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-white">Move</h1>
              <h1 className="font-display text-3xl font-bold text-gradient-red">Together</h1>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Train harder. Run faster. Join the crew that never stops moving.
              </p>
            </motion.div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              {links.map(({ to, label, icon: Icon, end }, index) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative group ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/30 to-red-700/20 shadow-red-glow"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className={`relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-red-400' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <span className="relative z-10">{label}</span>
                      {isActive && (
                        <div className="absolute right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse-red" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-red-600/30 bg-gradient-to-br from-red-950/40 to-black/60 p-4 backdrop-blur-xl shadow-red-glow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Signed in as</p>
              <p className="mt-2 font-semibold text-white truncate">{user?.name || "Runner"}</p>
              <p className="mt-1 truncate text-xs text-gray-500">{user?.email}</p>
              <div className="flex gap-2 mt-4">
                <NotificationsDropdown />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="btn-ghost flex-1 gap-2 text-xs"
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-2 md:py-4"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
