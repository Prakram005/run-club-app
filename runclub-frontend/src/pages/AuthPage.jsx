import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageCircle, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EngagingButton, GlowingText, FloatingParticles } from "../components/ui/EngagingUI";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-blue-950 to-purple-950 px-4 py-10 text-zinc-100 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr] relative z-10"
      >
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card overflow-hidden p-8 md:p-10 border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"
        >
          <motion.p
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-bold uppercase tracking-[0.35em] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            🏃 Run Club
          </motion.p>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 font-display text-5xl font-bold leading-tight"
          >
            <GlowingText color="cyan">Build your crew.</GlowingText>
            <br />
            <span className="text-white">Show up for the</span>
            <br />
            <GlowingText color="purple">run.</GlowingText>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 max-w-xl text-base text-cyan-300 font-semibold"
          >
            This upgraded app gives you personal event views, creator controls, real-time chat, nearby runs,
            and a leaderboard that keeps everyone moving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            {[
              { icon: Activity, title: "My Runs", desc: "Users land on their own runs first" },
              { icon: MessageCircle, title: "Live Chat", desc: "Each event gets its own chat room" },
              { icon: MapPin, title: "Map View", desc: "See nearby events on Google Maps" }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 hover:border-cyan-500/50 transition"
                >
                  <div className="flex items-center gap-2 text-2xl font-bold text-cyan-400">
                    <Icon size={20} />
                    {feature.title}
                  </div>
                  <p className="mt-2 text-sm text-purple-300">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card p-8 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
        >
          <motion.div
            className="mb-8 flex gap-3 rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${
                mode === "login"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "text-cyan-400"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${
                mode === "register"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "text-purple-400"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.label className="block text-sm font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Full Name
                  </motion.label>
                  <motion.input
                    type="text"
                    className="input w-full px-4 py-3 rounded-xl border-2 border-cyan-500/30 bg-cyan-500/5 text-white placeholder-cyan-600 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <motion.label className="block text-sm font-bold uppercase tracking-wider text-purple-400 mb-2">
                Email Address
              </motion.label>
              <motion.input
                type="email"
                className="input w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-purple-500/5 text-white placeholder-purple-600 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="your@email.com"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                required
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <motion.label className="block text-sm font-bold uppercase tracking-wider text-pink-400 mb-2">
                Password
              </motion.label>
              <motion.input
                type="password"
                className="input w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 bg-pink-500/5 text-white placeholder-pink-600 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                required
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <EngagingButton
                disabled={loading}
                className="w-full py-3 text-base font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Please wait...
                  </motion.span>
                ) : (
                  <>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {mode === "login" ? "🏃 Login Now" : "✨ Create Account"}
                    </motion.span>
                  </>
                )}
              </EngagingButton>
            </motion.div>
          </motion.form>

          <motion.p
            className="mt-6 text-center text-sm text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {mode === "login" ? "New to Run Club?" : "Already a member?"}{" "}
            <motion.button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text transition hover:from-purple-400 hover:to-pink-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode === "login" ? "Sign up here" : "Login here"}
            </motion.button>
          </motion.p>
        </motion.section>
      </motion.div>
    </div>
  );
}
