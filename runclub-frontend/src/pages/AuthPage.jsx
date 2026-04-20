import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Flame, MapPin, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FloatingInput } from "../components/ui";

const features = [
  { icon: Activity, title: "Personal runs", desc: "Your events, your pace, your crew." },
  { icon: MessageCircle, title: "Live chat", desc: "Keep every runner looped in." },
  { icon: MapPin, title: "Pinned meetups", desc: "Exact locations with smooth map flow." }
];

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
    <div className="relative min-h-screen overflow-hidden px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.16, 0.28, 0.16] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute left-[-6rem] top-10 h-72 w-72 rounded-full bg-red-500/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.24, 0.16] }}
          transition={{ duration: 9.5, repeat: Infinity, delay: 0.7 }}
          className="absolute bottom-[-5rem] right-[-4rem] h-80 w-80 rounded-full bg-red-900/20 blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.08fr_0.92fr]"
      >
        <motion.section
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="card-elevated overflow-hidden border border-red-500/20 p-8 md:p-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-600 to-red-800 shadow-red-glow-sm">
              <Flame size={24} className="text-white" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-red-300">Run Club</p>
          </div>

          <h1 className="mt-8 font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            Build your
            <span className="block text-gradient-red">next run crew.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-300">
            Create events, track your runners, and keep the entire club moving with a smoother experience.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 + index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="rounded-[26px] border border-white/10 bg-black/45 p-4"
                >
                  <div className="flex items-center gap-2 text-base font-bold text-white">
                    <Icon size={18} className="text-red-300" />
                    {feature.title}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card-elevated border border-red-500/20 p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 flex gap-2 rounded-[24px] border border-white/10 bg-black/45 p-1"
          >
            {[
              { id: "login", label: "Login" },
              { id: "register", label: "Sign up" }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`flex-1 rounded-[18px] px-4 py-3 text-sm font-bold uppercase tracking-[0.28em] transition ${
                  mode === item.id
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {mode === "register" ? (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.25 }}
                >
                  <FloatingInput
                    type="text"
                    label="Full name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <FloatingInput
              type="email"
              label="Email address"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              required
            />

            <FloatingInput
              type="password"
              label="Password"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              required
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary-glow w-full py-4 text-sm font-bold uppercase tracking-[0.28em]"
            >
              <span>{loading ? "Please wait..." : mode === "login" ? "Enter the club" : "Create account"}</span>
            </motion.button>
          </motion.form>

          <motion.p
            className="mt-6 text-center text-sm text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {mode === "login" ? "New to Run Club?" : "Already a member?"}{" "}
            <motion.button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold text-red-300 transition hover:text-red-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === "login" ? "Create an account" : "Log in instead"}
            </motion.button>
          </motion.p>
        </motion.section>
      </motion.div>
    </div>
  );
}
