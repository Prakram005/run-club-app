import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <section className="card overflow-hidden p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">Run Club</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight">
            Build your crew.
            <br />
            Show up for the run.
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            This upgraded app gives you personal event views, creator controls, real-time chat, nearby runs,
            and a leaderboard that keeps everyone moving.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-2xl font-bold text-brand-400">My Runs</p>
              <p className="mt-2 text-sm text-zinc-500">Users land on their own runs first, not the full global list.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-2xl font-bold text-brand-400">Live Chat</p>
              <p className="mt-2 text-sm text-zinc-500">Each event gets its own room for updates and coordination.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-2xl font-bold text-brand-400">Map View</p>
              <p className="mt-2 text-sm text-zinc-500">See nearby events on Google Maps and locate yourself fast.</p>
            </div>
          </div>
        </section>

        <section className="card p-8">
          <div className="mb-6 flex rounded-2xl border border-zinc-800 bg-zinc-950/60 p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium ${
                mode === "login" ? "bg-brand-400 text-zinc-950" : "text-zinc-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium ${
                mode === "register" ? "bg-brand-400 text-zinc-950" : "text-zinc-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" ? (
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  required
                />
              </div>
            ) : null}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(event) => update("password", event.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-zinc-500">
            {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-brand-400"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
