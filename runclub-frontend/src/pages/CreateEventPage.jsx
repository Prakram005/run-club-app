import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Calendar, Crosshair, FileText, MapPin, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import * as api from "../utils/api";
import { loadGoogleMapsScript } from "../utils/googleMaps";
import { EngagingButton, GlowingText } from "../components/ui/EngagingUI";

const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const today = new Date().toISOString().slice(0, 16);
const defaultCenter = { lat: 28.6139, lng: 77.209 };
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f0f1e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f0f1e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#06b6d4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0a14" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#16213e" }] }
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geocoderRef = useRef(null);
  const markerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: today,
    location: "",
    description: "",
    maxParticipants: 20,
    coordinates: null
  });

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const placeMarker = (position) => {
    if (!mapInstanceRef.current || !window.google?.maps) {
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({
        map: mapInstanceRef.current,
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

      markerRef.current.addListener("dragend", (event) => {
        const positionFromDrag = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };

        setPinnedLocation(positionFromDrag, { reverseGeocode: true, toastMessage: "Pin moved." });
      });
    }

    markerRef.current.setPosition(position);
  };

  const setPinnedLocation = (position, options = {}) => {
    const { reverseGeocode = false, toastMessage = "" } = options;

    placeMarker(position);
    mapInstanceRef.current?.panTo(position);
    mapInstanceRef.current?.setZoom(14);

    setForm((current) => ({
      ...current,
      coordinates: {
        latitude: position.lat,
        longitude: position.lng
      }
    }));

    if (!reverseGeocode || !geocoderRef.current) {
      if (toastMessage) {
        toast.success(toastMessage);
      }
      return;
    }

    geocoderRef.current.geocode({ location: position }, (results, status) => {
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
    if (!mapsKey || mapsKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setMapError("Add VITE_GOOGLE_MAPS_KEY to .env.local to pin an exact location.");
      setMapLoading(false);
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript(mapsKey)
      .then(() => {
        if (cancelled || !mapRef.current) {
          return;
        }

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 11,
          styles: mapStyle,
          disableDefaultUI: true,
          zoomControl: true
        });

        geocoderRef.current = new window.google.maps.Geocoder();

        mapInstanceRef.current.addListener("click", (event) => {
          setPinnedLocation(
            {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            },
            { reverseGeocode: true, toastMessage: "Pin dropped." }
          );
        });

        setMapLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError("Failed to load Google Maps. Check your API key.");
          setMapLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPinnedLocation(
          {
            lat: coords.latitude,
            lng: coords.longitude
          },
          { reverseGeocode: true, toastMessage: "Pinned your current location." }
        );
        setLocationLoading(false);
      },
      () => {
        toast.error("Could not access your location.");
        setLocationLoading(false);
      }
    );
  };

  const clearPin = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    setForm((current) => ({
      ...current,
      coordinates: null
    }));
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
        maxParticipants: Number(form.maxParticipants) || 20,
        coordinates: form.coordinates || undefined
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
          <p className="text-xs font-bold uppercase tracking-[0.35em] bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Create Event
          </p>
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
            Set the route, time, and drop an exact pin so runners can find it on the map.
          </motion.p>
        </motion.div>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card p-8 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
        >
          <motion.form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Event Title
              </label>
              <input
                type="text"
                className="input w-full px-4 py-3 rounded-xl border-2 border-cyan-500/30 bg-cyan-500/5 text-white placeholder-cyan-600 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                placeholder="Sunday Morning 5K"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-400 mb-3">
                  <Calendar size={16} />
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  className="input w-full px-4 py-3 rounded-xl border-2 border-purple-500/30 bg-purple-500/5 text-white placeholder-purple-600 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  min={today}
                  value={form.date}
                  onChange={(event) => update("date", event.target.value)}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pink-400 mb-3">
                  <Users size={16} />
                  Max Participants
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  className="input w-full px-4 py-3 rounded-xl border-2 border-pink-500/30 bg-pink-500/5 text-white placeholder-pink-600 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  value={form.maxParticipants}
                  onChange={(event) => update("maxParticipants", event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-400 mb-3">
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                className="input w-full px-4 py-3 rounded-xl border-2 border-blue-500/30 bg-blue-500/5 text-white placeholder-blue-600 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Central Park Gate 5"
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    location: event.target.value,
                    coordinates: null
                  }))
                }
              />
              <p className="mt-2 text-xs text-zinc-400">
                Type an address, or use the map below to drop an exact pin. Editing this field manually clears the saved pin.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-cyan-400">Pin Exact Meetup Spot</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Click on the map or use your current location to save coordinates for the Maps page.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={locateMe}
                    disabled={locationLoading || !!mapError}
                    className="btn-ghost gap-2"
                  >
                    <Crosshair size={15} />
                    {locationLoading ? "Locating..." : "Use My Location"}
                  </button>
                  <button
                    type="button"
                    onClick={clearPin}
                    disabled={!form.coordinates}
                    className="btn-ghost gap-2"
                  >
                    <X size={15} />
                    Clear Pin
                  </button>
                </div>
              </div>

              {mapError ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {mapError}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border-2 border-cyan-500/30">
                  {mapLoading ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/80 text-sm text-cyan-300">
                      Loading map...
                    </div>
                  ) : null}
                  <div ref={mapRef} className="h-[320px] w-full bg-gradient-to-br from-slate-900 to-zinc-950" />
                </div>
              )}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-300">
                {form.coordinates ? (
                  <span>
                    Pin saved at {form.coordinates.latitude.toFixed(5)}, {form.coordinates.longitude.toFixed(5)}
                  </span>
                ) : (
                  <span>No pin selected yet.</span>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-400 mb-3">
                <FileText size={16} />
                Description
              </label>
              <textarea
                className="input w-full px-4 py-3 rounded-xl border-2 border-orange-500/30 bg-orange-500/5 text-white placeholder-orange-600 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 min-h-[140px] resize-none"
                placeholder="Distance, pace, meetup instructions..."
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
              />
            </div>

            <div>
              <EngagingButton disabled={loading} className="w-full py-4 text-base font-bold uppercase tracking-wider">
                {loading ? "Creating event..." : "Create Event and Invite Crew"}
              </EngagingButton>
            </div>
          </motion.form>
        </motion.section>
      </motion.div>
    </div>
  );
}
