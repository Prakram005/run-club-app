import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageCircle, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EngagingButton, GlowingText } from "../components/ui/EngagingUI";

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
    <div className="min-h-screen bg-black px-4 py-10 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, linear: true }}
        className="absolute top-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, linear: true }}
        className="absolute -bottom-40 left-20 w-80 h-80 bg-red-700/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr] relative z-10"
      >
        {/* Left Section - Branding & Features */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card-elevated overflow-hidden p-8 md:p-10 border border-red-600/40"
        >
          <motion.p
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-xs font-bold uppercase tracking-[0.35em] bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
          >
            🔥 RUN CLUB
          </motion.p>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 font-display text-5xl font-bold leading-tight text-white"
          >
            Build your<br />
            <span className="text-gradient-red">crew.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 max-w-xl text-base text-gray-300 font-medium leading-relaxed"
          >
            Create runs. Track your crew. Compete on the leaderboard. Real-time chat. Map views. Everything you need to keep moving together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {[
              { icon: Activity, title: "Personal Runs", desc: "Your events, your way" },
              { icon: MessageCircle, title: "Live Chat", desc: "Connect with your crew" },
              { icon: MapPin, title: "Map View", desc: "Find nearby runners" }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-2xl border border-red-600/30 bg-red-950/20 backdrop-blur-md p-4 transition-all hover:border-red-600/60 hover:shadow-red-glow-sm"
                >
                  <div className="flex items-center gap-2 text-lg font-bold text-red-400">
                    <Icon size={20} />
                    {feature.title}
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Right Section - Auth Form */}
        <motion.section
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card-elevated p-8 border border-red-600/40"
        >
          {/* Mode Toggle */}
          <motion.div
            className="mb-8 flex gap-2 rounded-xl border border-red-600/30 bg-black/50 p-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${
                mode === "login"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow"
                  : "text-gray-400 hover:text-red-400"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${
                mode === "register"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow"
                  : "text-gray-400 hover:text-red-400"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input w-full px-4 py-3 rounded-lg"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input w-full px-4 py-3 rounded-lg"
                placeholder="your@email.com"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                Password
              </label>
              <input
                type="password"
                className="input w-full px-4 py-3 rounded-lg"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full py-3 text-base font-bold uppercase tracking-wider"
            >
              {loading ? (
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  Please wait...
                </motion.span>
              ) : (
                <>
                  {mode === "login" ? "🔥 Login Now" : "✨ Create Account"}
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.p
            className="mt-6 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {mode === "login" ? "New to Run Club?" : "Already a member?"}{" "}
            <motion.button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold text-red-400 hover:text-red-300 transition"
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
