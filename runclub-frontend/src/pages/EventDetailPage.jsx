import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Crosshair, Edit2, Loader2, MapPin, Navigation, Search, Star, Trash2, X } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ChatRoom from "../components/chat/ChatRoom";
import {
  Badge,
  EventCountdown,
  AnimatedEventStatus,
  LiveParticipantCounter,
  ActivityFeed,
  RouteSkeleton,
  FloatingInput,
  FloatingTextarea
} from "../components/ui";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api";
import { loadGoogleMapsScript } from "../utils/googleMaps";

const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const defaultCenter = { lat: 28.6139, lng: 77.209 };
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#ff7373" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#200808" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#120606" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#170707" }] }
];

function getParticipantId(entry) {
  return typeof entry === "object" ? entry?._id : entry;
}

function getReviewUserId(review) {
  return typeof review?.user === "object" ? review.user?._id : review?.user;
}

function getEventCoordinates(event) {
  const latitude = Number(event?.coordinates?.latitude);
  const longitude = Number(event?.coordinates?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { lat: latitude, lng: longitude };
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const editMapRef = useRef(null);
  const editMapInstanceRef = useRef(null);
  const editMarkerRef = useRef(null);
  const editGeocoderRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(searchParams.get("edit") === "1");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState("");
  const [editMapLoading, setEditMapLoading] = useState(true);
  const [editMapError, setEditMapError] = useState("");
  const [editLocationLoading, setEditLocationLoading] = useState(false);
  const [editSearchLoading, setEditSearchLoading] = useState(false);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });
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

  useEffect(() => {
    if (!event || !user?.id) {
      setReviewForm({ rating: 5, comment: "" });
      return;
    }

    const existingReview = event.reviews?.find((review) => String(getReviewUserId(review)) === String(user.id));

    setReviewForm({
      rating: existingReview?.rating || 5,
      comment: existingReview?.comment || ""
    });
  }, [event, user]);

  useEffect(() => {
    if (!event) {
      return;
    }

    if (!mapsKey || mapsKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setMapError("Add VITE_GOOGLE_MAPS_KEY to show the event pin on the detail page.");
      setMapLoading(false);
      return;
    }

    let cancelled = false;

    const renderEventPin = (position) => {
      if (!mapInstanceRef.current || !window.google?.maps) {
        return;
      }

      mapInstanceRef.current.setCenter(position);
      mapInstanceRef.current.setZoom(15);

      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 11,
            fillColor: "#f43f5e",
            fillOpacity: 0.95,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });
      }

      markerRef.current.setPosition(position);
      markerRef.current.setMap(mapInstanceRef.current);
    };

    setMapError("");
    setMapLoading(true);

    loadGoogleMapsScript(mapsKey)
      .then(() => {
        if (cancelled || !mapRef.current) {
          return;
        }

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 11,
            styles: mapStyle,
            disableDefaultUI: true,
            zoomControl: true
          });
        }

        if (!geocoderRef.current) {
          geocoderRef.current = new window.google.maps.Geocoder();
        }

        const coordinates = getEventCoordinates(event);

        if (coordinates) {
          renderEventPin(coordinates);
          setMapLoading(false);
          return;
        }

        if (!event.location) {
          setMapError("No location pin is available for this event yet.");
          setMapLoading(false);
          return;
        }

        geocoderRef.current.geocode({ address: event.location }, (results, status) => {
          if (cancelled) {
            return;
          }

          if (status !== "OK" || !results?.[0]) {
            setMapError("Could not load the event location on the map.");
            setMapLoading(false);
            return;
          }

          renderEventPin(results[0].geometry.location);
          setMapLoading(false);
        });
      })
      .catch(() => {
        if (!cancelled) {
          setMapError("Failed to load Google Maps for this event.");
          setMapLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [event]);

  const placeEditMarker = (position) => {
    if (!editMapInstanceRef.current || !window.google?.maps) {
      return;
    }

    if (!editMarkerRef.current) {
      editMarkerRef.current = new window.google.maps.Marker({
        map: editMapInstanceRef.current,
        draggable: true,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: "#f43f5e",
          fillOpacity: 0.95,
          strokeColor: "#ffffff",
          strokeWeight: 2
        }
      });

      editMarkerRef.current.addListener("dragend", (dragEvent) => {
        const positionFromDrag = {
          lat: dragEvent.latLng.lat(),
          lng: dragEvent.latLng.lng()
        };

        setEditPinnedLocation(positionFromDrag, { reverseGeocode: true, toastMessage: "Pin moved." });
      });
    }

    editMarkerRef.current.setPosition(position);
    editMarkerRef.current.setMap(editMapInstanceRef.current);
  };

  const setEditPinnedLocation = (position, options = {}) => {
    const { reverseGeocode = false, toastMessage = "" } = options;

    placeEditMarker(position);
    editMapInstanceRef.current?.panTo(position);
    editMapInstanceRef.current?.setZoom(14);

    setForm((current) => ({
      ...current,
      coordinates: {
        latitude: position.lat,
        longitude: position.lng
      }
    }));

    if (!reverseGeocode || !editGeocoderRef.current) {
      if (toastMessage) {
        toast.success(toastMessage);
      }
      return;
    }

    editGeocoderRef.current.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results?.[0]?.formatted_address) {
        setForm((current) => ({
          ...current,
          location: results[0].formatted_address,
          coordinates: {
            latitude: position.lat,
            longitude: position.lng
          }
        }));
      }

      if (toastMessage) {
        toast.success(toastMessage);
      }
    });
  };

  useEffect(() => {
    if (!editing) {
      return;
    }

    if (!mapsKey || mapsKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setEditMapError("Add VITE_GOOGLE_MAPS_KEY to update the event pin.");
      setEditMapLoading(false);
      return;
    }

    let cancelled = false;

    setEditMapError("");
    setEditMapLoading(true);

    loadGoogleMapsScript(mapsKey)
      .then(() => {
        if (cancelled || !editMapRef.current) {
          return;
        }

        if (!editMapInstanceRef.current) {
          editMapInstanceRef.current = new window.google.maps.Map(editMapRef.current, {
            center: defaultCenter,
            zoom: 11,
            styles: mapStyle,
            disableDefaultUI: true,
            zoomControl: true
          });
        }

        if (!editGeocoderRef.current) {
          editGeocoderRef.current = new window.google.maps.Geocoder();
        }

        window.google.maps.event.clearListeners(editMapInstanceRef.current, "click");
        editMapInstanceRef.current.addListener("click", (clickEvent) => {
          setEditPinnedLocation(
            {
              lat: clickEvent.latLng.lat(),
              lng: clickEvent.latLng.lng()
            },
            { reverseGeocode: true, toastMessage: "Pin dropped." }
          );
        });

        const coordinates = getEventCoordinates(form);

        if (coordinates) {
          placeEditMarker(coordinates);
          editMapInstanceRef.current.setCenter(coordinates);
          editMapInstanceRef.current.setZoom(14);
          setEditMapLoading(false);
          return;
        }

        if (editMarkerRef.current) {
          editMarkerRef.current.setMap(null);
        }

        setEditMapLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setEditMapError("Failed to load Google Maps for editing.");
          setEditMapLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [editing, form.coordinates]);

  if (loading) {
    return <RouteSkeleton title="Loading event details" description="Pulling chat, map pin, and participant activity." />;
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
  const reviews = event.reviews || [];
  const myReview = reviews.find((review) => String(getReviewUserId(review)) === myId);
  const canReview = isPast && isJoined && !isCreator;
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

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

  const handleReviewSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setReviewSaving(true);

    try {
      const response = await api.saveEventReview(id, reviewForm);
      setEvent(response.data);
      toast.success(myReview ? "Review updated." : "Review posted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save review.");
    } finally {
      setReviewSaving(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      const response = await api.deleteEventReview(id, reviewId);
      setEvent(response.data);
      toast.success("Review deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review.");
    }
  };

  const searchEditLocation = () => {
    const address = form.location.trim();

    if (!address) {
      toast.error("Enter a location to search.");
      return;
    }

    if (!editGeocoderRef.current) {
      toast.error("Map is still loading.");
      return;
    }

    setEditSearchLoading(true);

    editGeocoderRef.current.geocode({ address }, (results, status) => {
      if (status !== "OK" || !results?.[0]) {
        toast.error("Could not find that location.");
        setEditSearchLoading(false);
        return;
      }

      const found = results[0];
      const position = {
        lat: found.geometry.location.lat(),
        lng: found.geometry.location.lng()
      };

      setForm((current) => ({
        ...current,
        location: found.formatted_address
      }));
      setEditPinnedLocation(position, { toastMessage: "Location pinned from search." });
      setEditSearchLoading(false);
    });
  };

  const locateEditMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    setEditLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setEditPinnedLocation(
          {
            lat: coords.latitude,
            lng: coords.longitude
          },
          { reverseGeocode: true, toastMessage: "Pinned your current location." }
        );
        setEditLocationLoading(false);
      },
      () => {
        toast.error("Could not access your location.");
        setEditLocationLoading(false);
      }
    );
  };

  const clearEditPin = () => {
    if (editMarkerRef.current) {
      editMarkerRef.current.setMap(null);
      editMarkerRef.current = null;
    }

    setForm((current) => ({
      ...current,
      coordinates: null
    }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => navigate("/events")}
        className="flex items-center gap-2 text-sm font-semibold text-red-300 transition hover:text-red-200"
      >
        <ArrowLeft size={16} />
        Back to Events
      </button>

      <section className="card-elevated border border-red-500/20 p-6 md:p-7">
        {editing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-bold">Edit Event</h1>
              <button onClick={() => setEditing(false)} className="btn-ghost">
                Cancel
              </button>
            </div>

            <FloatingInput
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInput
                type="datetime-local"
                label="Date and Time"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />

              <FloatingInput
                type="number"
                label="Max Participants"
                min="1"
                max="500"
                value={form.maxParticipants}
                onChange={(event) =>
                  setForm((current) => ({ ...current, maxParticipants: event.target.value }))
                }
              />
            </div>

            <div>
              <div className="flex flex-col gap-3 md:flex-row">
                <FloatingInput
                  className="flex-1"
                  label="Location"
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      location: event.target.value,
                      coordinates: null
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={searchEditLocation}
                  disabled={editSearchLoading || editMapLoading || !!editMapError}
                  className="btn-ghost gap-2 md:min-w-[170px]"
                >
                  <Search size={15} />
                  {editSearchLoading ? "Searching..." : "Find on Map"}
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Search a place, click the map, or use your location to update the exact event pin.
              </p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-red-300">Update Event Pin</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Saving will update both the address and coordinates used in the Maps view.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={locateEditMe}
                    disabled={editLocationLoading || !!editMapError}
                    className="btn-ghost gap-2"
                  >
                    <Crosshair size={15} />
                    {editLocationLoading ? "Locating..." : "Use My Location"}
                  </button>
                  <button
                    type="button"
                    onClick={clearEditPin}
                    disabled={!form.coordinates}
                    className="btn-ghost gap-2"
                  >
                    <X size={15} />
                    Clear Pin
                  </button>
                </div>
              </div>

              {editMapError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {editMapError}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/40">
                  {editMapLoading ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-zinc-950/80 text-sm text-red-200">
                      <Loader2 size={18} className="animate-spin" />
                      Loading map...
                    </div>
                  ) : null}
                  <div ref={editMapRef} className="h-[260px] w-full bg-gradient-to-br from-slate-900 to-zinc-950" />
                </div>
              )}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-300">
                {form.coordinates ? (
                  <span>
                    Pin saved at {form.coordinates.latitude.toFixed(5)}, {form.coordinates.longitude.toFixed(5)}
                  </span>
                ) : (
                  <span>No exact pin selected yet.</span>
                )}
              </div>
            </div>

            <FloatingTextarea
              label="Description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />

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
                  {reviews.length > 0 ? (
                    <Badge variant="brand">
                      {averageRating.toFixed(1)} stars ({reviews.length})
                    </Badge>
                  ) : null}
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
                <Calendar size={15} className="text-red-300" />
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

            {isPast ? (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-black/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">Run Reviews</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {reviews.length
                        ? `${averageRating.toFixed(1)} average from ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
                        : "No reviews yet."}
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("reviews")} className="btn-ghost gap-2">
                    <Star size={15} />
                    {canReview ? (myReview ? "Edit Review" : "Review Run") : "View Reviews"}
                  </button>
                </div>
              </div>
            ) : null}

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

            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
                <MapPin size={15} />
                Live Pin Location
              </div>
              {mapError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {mapError}
                </div>
              ) : null}
              <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/40">
                {mapLoading ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-zinc-950/80 text-sm text-red-200">
                    <Loader2 size={18} className="animate-spin" />
                    Loading event map...
                  </div>
                ) : null}
                <div ref={mapRef} className="h-[260px] w-full bg-gradient-to-br from-slate-900 to-zinc-950" />
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/45 p-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`rounded-xl px-4 py-2 text-sm transition ${activeTab === "chat" ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm" : "text-zinc-400 hover:text-white"}`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`rounded-xl px-4 py-2 text-sm ${
              activeTab === "participants"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Participants ({count})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`rounded-xl px-4 py-2 text-sm ${
              activeTab === "activity"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`rounded-xl px-4 py-2 text-sm ${
              activeTab === "reviews"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === "chat" ? (
          <ChatRoom eventId={id} />
        ) : activeTab === "activity" ? (
          <ActivityFeed eventId={id} />
        ) : activeTab === "reviews" ? (
          <div className="card space-y-5 p-5">
            {canReview ? (
              <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-red-500/20 bg-black/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">{myReview ? "Update your review" : "Review this run"}</p>
                    <p className="mt-1 text-xs text-zinc-500">Share how the organised run felt for other runners.</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm((current) => ({ ...current, rating }))}
                        className="rounded-full p-1 text-red-300 transition hover:scale-110"
                        aria-label={`Rate ${rating} star${rating === 1 ? "" : "s"}`}
                      >
                        <Star
                          size={22}
                          fill={rating <= reviewForm.rating ? "currentColor" : "none"}
                          className={rating <= reviewForm.rating ? "text-red-300" : "text-zinc-600"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewForm.comment}
                  onChange={(changeEvent) =>
                    setReviewForm((current) => ({ ...current, comment: changeEvent.target.value }))
                  }
                  maxLength={700}
                  rows={4}
                  placeholder="What was the pace, route, vibe, or organisation like?"
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/50"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500">{reviewForm.comment.length}/700</span>
                  <button type="submit" disabled={reviewSaving} className="btn-primary">
                    {reviewSaving ? "Saving..." : myReview ? "Update Review" : "Post Review"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-zinc-400">
                {isPast
                  ? "Only runners who joined this run can leave a review."
                  : "Reviews open after the run is completed."}
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => {
                  const reviewUserId = getReviewUserId(review);
                  const reviewerName = typeof review.user === "object" ? review.user.name : "Runner";
                  const canDeleteReview = String(reviewUserId) === myId || isCreator;

                  return (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/10 bg-zinc-950/45 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {reviewerName} {String(reviewUserId) === myId ? "(you)" : ""}
                          </p>
                          <div className="mt-1 flex gap-1 text-red-300">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                size={15}
                                fill={rating <= review.rating ? "currentColor" : "none"}
                                className={rating <= review.rating ? "text-red-300" : "text-zinc-700"}
                              />
                            ))}
                          </div>
                        </div>
                        {canDeleteReview ? (
                          <button
                            onClick={() => handleReviewDelete(review._id)}
                            className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 transition hover:text-red-300"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                      {review.comment ? (
                        <p className="mt-3 text-sm leading-6 text-zinc-300">{review.comment}</p>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-sm font-bold text-red-200">
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
