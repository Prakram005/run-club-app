import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as api from "../utils/api";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-zinc-400">
        <ArrowLeft size={16} />
        Back
      </button>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">New Event</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Create a Run</h1>
        <p className="mt-2 text-sm text-zinc-400">Set up your event and invite the crew.</p>
      </div>

      <section className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Event Title</label>
            <input
              className="input"
              placeholder="Sunday Morning 5K"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Date and Time</label>
              <input
                type="datetime-local"
                className="input"
                min={today}
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Max Participants</label>
              <input
                type="number"
                min="1"
                max="500"
                className="input"
                value={form.maxParticipants}
                onChange={(event) => update("maxParticipants", event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Location</label>
            <input
              className="input"
              placeholder="Central Park Gate 5"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[120px]"
              placeholder="Distance, pace, and meetup instructions"
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </section>
    </div>
  );
}
