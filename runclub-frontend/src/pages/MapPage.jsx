import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Loader2, MapPin, Navigation, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MapControls from "../components/map/MapControls";
import { EventMarkerInfoCard } from "../components/map/LiveRunMarker";
import { EngagingButton, GlowingText, FloatingParticles } from "../components/ui/EngagingUI";
import * as api from "../utils/api";

const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const darkStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f0f1e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f0f1e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#06b6d4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0a14" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#16213e" }] }
];

function loadMapsScript(key) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geocoderRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [mapsError, setMapsError] = useState("");
  const [selected, setSelected] = useState(null);
  const [liveTracking, setLiveTracking] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const userLocationMarkerRef = useRef(null);

  useEffect(() => {
    api.getEvents().then((response) => setEvents(response.data || []));
  }, []);

  useEffect(() => {
    if (!mapsKey || mapsKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setMapsError("Add VITE_GOOGLE_MAPS_KEY to .env.local to enable the map.");
      setLoading(false);
      return;
    }

    loadMapsScript(mapsKey)
      .then(() => {
        if (!mapRef.current) {
          return;
        }

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 11,
          styles: darkStyle,
          disableDefaultUI: true,
          zoomControl: true
        });

        geocoderRef.current = new window.google.maps.Geocoder();
        infoWindowRef.current = new window.google.maps.InfoWindow();
        setLoading(false);
      })
      .catch(() => {
        setMapsError("Failed to load Google Maps. Check your API key.");
        setLoading(false);
      });
  }, []);

  const placeMarkers = useCallback(() => {
    if (!mapInstance.current || !geocoderRef.current) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    events
      .filter((event) => new Date(event.date) >= new Date() && event.location)
      .forEach((event) => {
        geocoderRef.current.geocode({ address: event.location }, (results, status) => {
          if (status !== "OK" || !results?.[0]) {
            return;
          }

          const marker = new window.google.maps.Marker({
            map: mapInstance.current,
            position: results[0].geometry.location,
            title: event.title,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#06b6d4",
              fillOpacity: 0.9,
              strokeColor: "#0891b2",
              strokeWeight: 2
            }
          });

          marker.addListener("click", () => {
            setSelected(event);
            infoWindowRef.current?.setContent(
              `<div style="background:#0f0f1e;color:#f4f4f5;padding:12px 16px;border-radius:12px;min-width:220px;border:1px solid #06b6d4;">
                <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#06b6d4;">${event.title}</div>
                <div style="font-size:12px;color:#a1a1aa;margin-bottom:4px;">${event.location}</div>
                <div style="font-size:11px;color:#71717a;">${format(new Date(event.date), "MMM d h:mm a")}</div>
                <div style="font-size:11px;color:#06b6d4;margin-top:4px;">👥 ${event.participants?.length || 0} runners</div>
              </div>`
            );
            infoWindowRef.current?.open(mapInstance.current, marker);
          });

          markersRef.current.push(marker);
        });
      });
  }, [events]);

  useEffect(() => {
    if (!loading && !mapsError) {
      placeMarkers();
    }
  }, [loading, mapsError, placeMarkers]);

  const locateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported.");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        mapInstance.current?.setCenter(position);
        mapInstance.current?.setZoom(13);

        // Remove old marker
        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.setMap(null);
        }

        // Add new marker with custom styling
        userLocationMarkerRef.current = new window.google.maps.Marker({
          map: mapInstance.current,
          position,
          title: "Your Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#06b6d4",
            fillOpacity: 1,
            strokeColor: "#0891b2",
            strokeWeight: 3
          }
        });

        setGeoLoading(false);
      },
      () => {
        setGeoError("Could not get your location. Please allow location access.");
        setGeoLoading(false);
      }
    );
  };

  const upcomingWithLocation = events.filter((event) => new Date(event.date) >= new Date() && event.location);

  return (
    <div className="space-y-6 relative">
      {animationsEnabled && <FloatingParticles />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🗺️ Explore
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">
            <GlowingText color="cyan">Runs Near Me</GlowingText>
          </h1>
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2 text-sm text-cyan-400"
          >
            🔴 {upcomingWithLocation.length} live events with locations
          </motion.p>
        </div>
        <div className="flex gap-3">
          <MapControls onToggleLiveTracking={setLiveTracking} onToggleHeatmap={setShowHeatmap} onToggleAnimations={setAnimationsEnabled} />
          <EngagingButton
            onClick={locateMe}
            disabled={geoLoading || loading || !!mapsError}
            icon={Navigation}
            variant="primary"
          >
            {geoLoading ? "Locating..." : "Locate Me"}
          </EngagingButton>
        </div>
      </motion.div>

      {geoError ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-red-500/10 backdrop-blur px-4 py-3 text-sm text-pink-300"
        >
          <AlertCircle size={15} />
          {geoError}
        </motion.div>
      ) : null}

      {mapsError ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-pink-500/10"
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <MapPin size={40} className="mx-auto text-red-500" />
          </motion.div>
          <p className="mt-4 text-sm text-red-300 font-semibold">{mapsError}</p>
          <pre className="mt-6 rounded-xl bg-zinc-950 p-4 text-left text-xs text-cyan-400 border border-cyan-500/30">
{`# .env.local
VITE_GOOGLE_MAPS_KEY=your_key_here`}
          </pre>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
        >
          {loading ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-zinc-950/80 backdrop-blur"
            >
              <Loader2 size={28} className="animate-spin text-cyan-400" />
            </motion.div>
          ) : null}
          <div ref={mapRef} className="h-[500px] w-full bg-gradient-to-br from-slate-900 to-zinc-950" />
          {liveTracking && !loading && (
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-cyan-500/20 backdrop-blur px-4 py-2 border border-cyan-500/50"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-cyan-400">LIVE MODE ACTIVE</span>
            </motion.div>
          )}
        </motion.div>
      )}

      {selected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="card p-6 border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <motion.p
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                📍 Selected Event
              </motion.p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{selected.title}</h3>
              <motion.p
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-3 text-sm text-cyan-300 font-semibold"
              >
                📍 {selected.location}
              </motion.p>
              <p className="mt-1 text-xs text-purple-300">⏰ {format(new Date(selected.date), "EEE, MMM d h:mm a")}</p>
              <p className="mt-1.5 text-sm text-blue-300">👥 {selected.participants?.length || 0} / {selected.maxParticipants || 20} runners</p>
            </div>
            <div className="flex gap-2">
              <EngagingButton onClick={() => navigate(`/events/${selected._id}`)} variant="primary">
                View Event
              </EngagingButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelected(null);
                  infoWindowRef.current?.close();
                }}
                className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-4 font-display text-2xl font-bold">
          <GlowingText color="cyan">▶ Upcoming Events</GlowingText>
        </h2>
        {upcomingWithLocation.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-8 text-center text-sm border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          >
            <p className="text-purple-300">📍 No events with location data yet.</p>
            <p className="mt-2 text-xs text-zinc-400">Add a location when creating events to see them here.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {upcomingWithLocation.map((event, index) => (
              <motion.button
                key={event._id}
                onClick={() => setSelected(event)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-5 rounded-xl text-left border-2 transition cursor-pointer overflow-hidden group ${
                  selected?._id === event._id
                    ? "border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
                    : "border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50"
                }`}
              >
                <p className="font-bold text-white group-hover:text-cyan-300 transition">{event.title}</p>
                <p className="mt-2 text-sm text-blue-300">📍 {event.location}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <p className="text-purple-300">⏰ {format(new Date(event.date), "MMM d")}</p>
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-cyan-400 font-semibold"
                  >
                    👥 {event.participants?.length || 0}
                  </motion.p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
