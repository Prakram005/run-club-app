import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import * as api from "../utils/api";
import { EngagingButton, GlowingText } from "../components/ui/EngagingUI";

const today = new Date().toISOString().slice(0, 16);

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: today,
    location: "",
    description: "",
    maxParticipants: 20
  });

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.date) {
      toast.error("Title and date are required.");
      return;
    }

    setLoading(true);

    try {
      await api.createEvent({
        title: form.title.trim(),
        date: new Date(form.date).toISOString(),
        location: form.location.trim(),
        description: form.description.trim(),
        maxParticipants: Number(form.maxParticipants) || 20
      });

      toast.success("Event created.");
      navigate("/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-purple-950 to-pink-950 px-4 py-10 text-zinc-100 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl space-y-8 relative z-10"
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition"
          whileHover={{ gap: "12px" }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          Back to Events
        </motion.button>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.p
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-bold uppercase tracking-[0.35em] bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            🏃 Create Event
          </motion.p>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 font-display text-5xl font-bold leading-tight"
          >
            <GlowingText color="purple">Organize your</GlowingText>
            <br />
            <GlowingText color="pink">perfect run</GlowingText>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-lg text-purple-300 font-semibold"
          >
            Set the route, time, and invite your crew to join the action.
          </motion.p>
        </motion.div>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card p-8 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
        >
          <motion.form onSubmit={handleSubmit} className="space-y-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.label className="block text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Event Title
              </motion.label>
              <motion.input
                type="text"
                className="input w-full px-4 py-3 rounded-xl border-2 border-cyan-500/30 bg-cyan-500/5 text-white placeholder-cyan-600 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                placeholder="Sunday Morning 5K"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                required
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div
              className="grid gap-6 md:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, staggerChildren: 0.05 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <motion.label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-400 mb-3">
                  <Calendar size={16} />
                  Date & Time
                </motion.label>
                <motion.input
                  type="datetime-local"
                  className="input w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-purple-500/5 text-white placeholder-purple-600 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  min={today}
                  value={form.date}
                  onChange={(event) => update("date", event.target.value)}
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pink-400 mb-3">
                  <Users size={16} />
                  Max Participants
                </motion.label>
                <motion.input
                  type="number"
                  min="1"
                  max="500"
                  className="input w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 bg-pink-500/5 text-white placeholder-pink-600 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  value={form.maxParticipants}
                  onChange={(event) => update("maxParticipants", event.target.value)}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <motion.label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-400 mb-3">
                <MapPin size={16} />
                Location
              </motion.label>
              <motion.input
                type="text"
                className="input w-full px-4 py-3 rounded-xl border-2 border-blue-500/30 bg-blue-500/5 text-white placeholder-blue-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Central Park Gate 5"
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-400 mb-3">
                <FileText size={16} />
                Description
              </motion.label>
              <motion.textarea
                className="input w-full px-4 py-3 rounded-xl border-2 border-orange-500/30 bg-orange-500/5 text-white placeholder-orange-600 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 min-h-[140px] resize-none"
                placeholder="Distance, pace, meetup instructions..."
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <EngagingButton disabled={loading} className="w-full py-4 text-base font-bold uppercase tracking-wider">
                {loading ? (
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Creating event...
                  </motion.span>
                ) : (
                  "✨ Create Event & Invite Crew"
                )}
              </EngagingButton>
            </motion.div>
          </motion.form>
        </motion.section>
      </motion.div>
    </div>
  );
}
