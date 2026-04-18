import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Edit2, MapPin, Navigation, Trash2, Users } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ChatRoom from "../components/chat/ChatRoom";
import { Badge, Spinner, EventCountdown, AnimatedEventStatus, LiveParticipantCounter, ActivityFeed, LiveRunTracker } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";

function getParticipantId(entry) {
  return typeof entry === "object" ? entry?._id : entry;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(searchParams.get("edit") === "1");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    coordinates: null,
    description: "",
    maxParticipants: 20
  });

  const load = () => {
    setLoading(true);
    api
      .getEvents()
      .then((response) => {
        const selected = (response.data || []).find((entry) => entry._id === id);
        setEvent(selected || null);

        if (selected) {
          setForm({
            title: selected.title || "",
            date: selected.date ? selected.date.slice(0, 16) : "",
            location: selected.location || "",
            coordinates: selected.coordinates || null,
            description: selected.description || "",
            maxParticipants: selected.maxParticipants || 20
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="card p-10 text-center">
        <p className="text-zinc-400">Event not found.</p>
      </div>
    );
  }

  const myId = String(user?.id || "");
  const isCreator = String(event.createdBy) === myId;
  const isJoined = event.participants?.some((entry) => String(getParticipantId(entry)) === myId);
  const isPast = new Date(event.date) < new Date();
  const count = event.participants?.length || 0;

  const handleSave = async () => {
    setSaving(true);

    try {
      await api.updateEvent(id, {
        ...form,
        date: new Date(form.date).toISOString(),
        maxParticipants: Number(form.maxParticipants)
      });

      toast.success("Event updated.");
      setEditing(false);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event? This cannot be undone.")) {
      return;
    }

    try {
      await api.deleteEvent(id);
      toast.success("Event deleted.");
      navigate("/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleJoinLeave = async (mode) => {
    try {
      if (mode === "join") {
        await api.joinEvent(id);
      } else {
        await api.leaveEvent(id);
      }

      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button onClick={() => navigate("/events")} className="flex items-center gap-2 text-sm text-zinc-400">
        <ArrowLeft size={16} />
        Back to Events
      </button>

      <section className="card p-6">
        {editing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-bold">Edit Event</h1>
              <button onClick={() => setEditing(false)} className="btn-ghost">
                Cancel
              </button>
            </div>

            <div>
              <label className="label">Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Date and Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                />
              </div>

              <div>
                <label className="label">Max Participants</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="500"
                  value={form.maxParticipants}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, maxParticipants: event.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">Location</label>
              <input
                className="input"
                value={form.location}
                onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input min-h-[110px]"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <AnimatedEventStatus event={event} isPast={isPast} />
                  {isCreator ? <Badge variant="brand">Organiser</Badge> : null}
                  {isJoined && !isCreator ? <Badge variant="green">Joined</Badge> : null}
                </div>
                <h1 className="font-display text-3xl font-bold">{event.title}</h1>
              </div>

              {isCreator ? (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)} className="btn-ghost gap-2">
                    <Edit2 size={15} />
                    Edit
                  </button>
                  <button onClick={handleDelete} className="btn-danger gap-2">
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-6 space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-brand-400" />
                <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy h:mm a")}</span>
              </div>
              {event.location ? (
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-red-400" />
                  <span>{event.location}</span>
                </div>
              ) : null}
            </div>

            {event.description ? <p className="mt-5 text-sm leading-6 text-zinc-400">{event.description}</p> : null}

            {!isPast && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <EventCountdown eventDate={event.date} />
                <div className="rounded-lg bg-zinc-900/50 p-4">
                  <LiveParticipantCounter
                    currentCount={count}
                    maxCount={event.maxParticipants || 20}
                    isLive={true}
                  />
                </div>
              </div>
            )}

            {!isPast ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => navigate(`/map?eventId=${event._id}`)} className="btn-ghost gap-2">
                  <Navigation size={15} />
                  Open in Map
                </button>
                {!isCreator && !isJoined ? (
                  <button onClick={() => handleJoinLeave("join")} className="btn-primary">
                    Join Event
                  </button>
                ) : null}
                {!isCreator && isJoined ? (
                  <button onClick={() => handleJoinLeave("leave")} className="btn-danger">
                    Leave Event
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`rounded-xl px-4 py-2 text-sm ${activeTab === "chat" ? "bg-brand-400 text-zinc-950" : "text-zinc-400"}`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`rounded-xl px-4 py-2 text-sm ${
              activeTab === "participants" ? "bg-brand-400 text-zinc-950" : "text-zinc-400"
            }`}
          >
            Participants ({count})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`rounded-xl px-4 py-2 text-sm ${
              activeTab === "activity" ? "bg-brand-400 text-zinc-950" : "text-zinc-400"
            }`}
          >
            Activity
          </button>
        </div>

        {activeTab === "chat" ? (
          <ChatRoom eventId={id} />
        ) : activeTab === "activity" ? (
          <ActivityFeed eventId={id} />
        ) : (
          <div className="card p-5">
            {count === 0 ? (
              <p className="text-sm text-zinc-500">No participants yet.</p>
            ) : (
              <div className="space-y-3">
                {event.participants?.map((participant, index) => {
                  const participantId = getParticipantId(participant);
                  const name = typeof participant === "object" ? participant.name : `Participant ${index + 1}`;
                  return (
                    <motion.div
                      key={participantId || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-400/15 text-sm font-bold text-brand-300">
                        {String(name || "R").charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-zinc-200">
                        {name} {String(participantId) === myId ? "(you)" : ""}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
