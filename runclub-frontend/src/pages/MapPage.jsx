import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Loader2, MapPin, Navigation, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import MapControls from "../components/map/MapControls";
import { EngagingButton, GlowingText, FloatingParticles } from "../components/ui/EngagingUI";
import { useAuth } from "../context/AuthContext";
import { loadGoogleMapsScript } from "../utils/googleMaps";
import * as api from "../utils/api";

const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const defaultCenter = { lat: 28.6139, lng: 77.209 };
const darkStyle = [
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

function getEventCoordinates(event) {
  const latitude = Number(event?.coordinates?.latitude);
  const longitude = Number(event?.coordinates?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { lat: latitude, lng: longitude };
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function distanceInKm(from, to) {
  if (!from || !to) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const lngDelta = ((to.lng - from.lng) * Math.PI) / 180;
  const startLat = (from.lat * Math.PI) / 180;
  const endLat = (to.lat * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geocoderRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);
  const markerIndexRef = useRef(new Map());
  const userLocationMarkerRef = useRef(null);
  const focusedEventRef = useRef(null);
  const heatmapRef = useRef(null);
  const audioRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [mapsError, setMapsError] = useState("");
  const [selected, setSelected] = useState(null);
  const [liveTracking, setLiveTracking] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const eventId = searchParams.get("eventId");
  const [scope, setScope] = useState(eventId ? "community" : "mine");

  useEffect(() => {
    api.getEvents().then((response) => setEvents(response.data || []));
  }, []);

  useEffect(() => {
    if (eventId) {
      focusedEventRef.current = eventId;
    }
  }, [eventId]);

  useEffect(() => {
    if (!mapsKey || mapsKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setMapsError("Add VITE_GOOGLE_MAPS_KEY to .env.local to enable the map.");
      setLoading(false);
      return;
    }

    loadGoogleMapsScript(mapsKey)
      .then(() => {
        if (!mapRef.current) {
          return;
        }

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
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

  const openEventMarker = useCallback((event, marker) => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setSelected(event);
    infoWindowRef.current?.setContent(
      `<div style="background:#090909;color:#f4f4f5;padding:12px 16px;border-radius:16px;min-width:220px;border:1px solid rgba(255,77,77,0.28);box-shadow:0 0 24px rgba(255,26,26,0.18);">
        <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#ff7373;">${escapeHtml(event.title)}</div>
        <div style="font-size:12px;color:#a1a1aa;margin-bottom:4px;">${escapeHtml(event.location || "Pinned meetup spot")}</div>
        <div style="font-size:11px;color:#71717a;">${format(new Date(event.date), "MMM d h:mm a")}</div>
        <div style="font-size:11px;color:#ff9999;margin-top:4px;">${event.participants?.length || 0} runners</div>
      </div>`
    );
    infoWindowRef.current?.open(mapInstance.current, marker);
  }, [soundEnabled]);

  const renderMarker = useCallback((event, position) => {
    const marker = new window.google.maps.Marker({
      map: mapInstance.current,
      position,
      title: event.title,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#ff4d4f",
        fillOpacity: 0.9,
        strokeColor: "#7f1d1d",
        strokeWeight: 2
      }
    });

    marker.addListener("click", () => {
      openEventMarker(event, marker);
    });

    if (focusedEventRef.current && focusedEventRef.current === event._id) {
      mapInstance.current?.setCenter(position);
      mapInstance.current?.setZoom(15);
      openEventMarker(event, marker);
      focusedEventRef.current = null;
    }

    markerIndexRef.current.set(event._id, marker);
    markersRef.current.push(marker);
  }, [openEventMarker]);

  const visibleEvents = useMemo(() => {
    const myId = String(user?.id || "");

    if (!myId || scope === "community") {
      return events;
    }

    return events.filter(
      (event) =>
        String(event.createdBy) === myId ||
        event.participants?.some((entry) => String(getParticipantId(entry)) === myId)
    );
  }, [events, scope, user]);

  const placeMarkers = useCallback(() => {
    if (!mapInstance.current || !geocoderRef.current || !window.google?.maps) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    markerIndexRef.current = new Map();

    visibleEvents
      .filter((event) => new Date(event.date) >= new Date() && (event.location || getEventCoordinates(event)))
      .forEach((event) => {
        const savedCoordinates = getEventCoordinates(event);

        if (savedCoordinates) {
          renderMarker(event, savedCoordinates);
          return;
        }

        geocoderRef.current.geocode({ address: event.location }, (results, status) => {
          if (status !== "OK" || !results?.[0]) {
            return;
          }

          renderMarker(event, results[0].geometry.location);
        });
      });
  }, [renderMarker, visibleEvents]);

  useEffect(() => {
    if (!loading && !mapsError) {
      placeMarkers();
    }
  }, [loading, mapsError, placeMarkers]);

  const focusEvent = useCallback((event) => {
    setSelected(event);

    const marker = markerIndexRef.current.get(event._id);

    if (marker) {
      const position = marker.getPosition();

      if (position) {
        mapInstance.current?.setCenter(position);
        mapInstance.current?.setZoom(15);
      }

      openEventMarker(event, marker);
      return;
    }

    const savedCoordinates = getEventCoordinates(event);

    if (savedCoordinates) {
      mapInstance.current?.setCenter(savedCoordinates);
      mapInstance.current?.setZoom(15);
    }
  }, [openEventMarker]);

  // Heatmap effect
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps || !showHeatmap) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      return;
    }

    const heatmapData = events
      .filter((event) => new Date(event.date) >= new Date())
      .map((event) => {
        const coords = getEventCoordinates(event);
        if (coords) {
          return new window.google.maps.LatLng(coords.lat, coords.lng);
        }
        return null;
      })
      .filter(Boolean);

    if (heatmapData.length === 0) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      return;
    }

    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance.current,
      radius: 25,
      opacity: 0.6,
      gradient: [
        "#120606",
        "#4c0d0d",
        "#991b1b",
        "#dc2626",
        "#f87171"
      ]
    });
  }, [showHeatmap, visibleEvents]);

  // Sound effect playback
  useEffect(() => {
    if (!soundEnabled || !audioRef.current) return;

    // Play a subtle notification sound on marker hover
    const playSound = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Audio playback silently fails if there's any issue
        });
      }
    };

    window.playMapSound = playSound;

    return () => {
      delete window.playMapSound;
    };
  }, [soundEnabled]);

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
        setUserPosition(position);
        mapInstance.current?.setCenter(position);
        mapInstance.current?.setZoom(13);

        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.setMap(null);
        }

        userLocationMarkerRef.current = new window.google.maps.Marker({
          map: mapInstance.current,
          position,
          title: "Your Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
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

  const upcomingWithLocation = useMemo(() => {
    const list = visibleEvents.filter(
      (event) => new Date(event.date) >= new Date() && (event.location || getEventCoordinates(event))
    );

    return list
      .map((event) => ({
        ...event,
        distanceKm: distanceInKm(userPosition, getEventCoordinates(event))
      }))
      .sort((left, right) => {
        if (left.distanceKm == null && right.distanceKm == null) {
          return new Date(left.date) - new Date(right.date);
        }

        if (left.distanceKm == null) {
          return 1;
        }

        if (right.distanceKm == null) {
          return -1;
        }

        return left.distanceKm - right.distanceKm;
      });
  }, [userPosition, visibleEvents]);

  return (
    <div className="space-y-6 relative">
      <audio 
        ref={audioRef} 
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==" 
        preload="auto" 
      />
      {animationsEnabled && <FloatingParticles />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
            Explore
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">
            <GlowingText color="red">{scope === "mine" ? "My run map" : "Community map"}</GlowingText>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">{upcomingWithLocation.length} upcoming events with pinned meetup spots</p>
        </div>
        <div className="flex gap-3">
          <MapControls
            onToggleLiveTracking={setLiveTracking}
            onToggleHeatmap={setShowHeatmap}
            onToggleAnimations={setAnimationsEnabled}
            onToggleSound={setSoundEnabled}
            liveTracking={liveTracking}
            showHeatmap={showHeatmap}
            animationsEnabled={animationsEnabled}
            soundEnabled={soundEnabled}
          />
          <EngagingButton onClick={locateMe} disabled={geoLoading || loading || !!mapsError} icon={Navigation} variant="primary">
            {geoLoading ? "Locating..." : "Locate Me"}
          </EngagingButton>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-black/45 p-1.5 backdrop-blur">
        {[
          { id: "mine", label: "My runs" },
          { id: "community", label: "Community" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setScope(item.id)}
            className={`rounded-[18px] px-4 py-2.5 text-sm font-semibold transition ${
              scope === item.id
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {geoError ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur"
        >
          <AlertCircle size={15} />
          {geoError}
        </motion.div>
      ) : null}

      {mapsError ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center border border-red-500/20 bg-black/45"
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <MapPin size={40} className="mx-auto text-red-300" />
          </motion.div>
          <p className="mt-4 text-sm font-semibold text-red-200">{mapsError}</p>
          <pre className="mt-6 rounded-xl border border-white/10 bg-zinc-950 p-4 text-left text-xs text-red-200">
{`# .env.local
VITE_GOOGLE_MAPS_KEY=your_key_here`}
          </pre>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-[28px] border border-red-500/20 shadow-2xl shadow-red-950/20"
        >
          {loading ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-zinc-950/80 backdrop-blur"
            >
              <Loader2 size={28} className="animate-spin text-red-300" />
            </motion.div>
          ) : null}
          <div ref={mapRef} className="h-[500px] w-full bg-gradient-to-br from-slate-900 to-zinc-950" />
          {liveTracking && !loading ? (
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 backdrop-blur"
            >
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-200">LIVE MODE ACTIVE</span>
            </motion.div>
          ) : null}
        </motion.div>
      )}

      {selected ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border border-red-500/20 bg-black/45"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-red-300">
                Selected Event
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{selected.title}</h3>
              <p className="mt-3 text-sm font-semibold text-red-200">{selected.location || "Pinned meetup spot"}</p>
              <p className="mt-1 text-xs text-zinc-400">{format(new Date(selected.date), "EEE, MMM d h:mm a")}</p>
              <p className="mt-1.5 text-sm text-zinc-300">
                {selected.participants?.length || 0} / {selected.maxParticipants || 20} runners
              </p>
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
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 transition hover:border-red-500/20 hover:bg-zinc-800"
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : null}

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="mb-4 font-display text-2xl font-bold">
          <GlowingText color="soft">Upcoming events</GlowingText>
        </h2>
        {upcomingWithLocation.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-8 text-center text-sm border border-red-500/20 bg-black/45"
          >
            <p className="text-red-200">No events with location data yet.</p>
            <p className="mt-2 text-xs text-zinc-400">Add a location when creating events to see them here.</p>
          </motion.div>
        ) : (
          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {upcomingWithLocation.map((event, index) => (
              <motion.button
                key={event._id}
                onClick={() => focusEvent(event)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group overflow-hidden rounded-[24px] border p-5 text-left transition ${
                  selected?._id === event._id
                    ? "border-red-400/30 bg-red-500/12"
                    : "border-white/10 bg-black/40 hover:border-red-500/20"
                }`}
              >
                <p className="font-bold text-white transition group-hover:text-red-200">{event.title}</p>
                <p className="mt-2 text-sm text-zinc-300">{event.location || "Pinned meetup spot"}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <p className="text-zinc-500">{format(new Date(event.date), "MMM d")}</p>
                  <p className="font-semibold text-red-200">{event.participants?.length || 0} runners</p>
                </div>
                {event.distanceKm != null ? (
                  <p className="mt-3 text-xs text-red-200">{event.distanceKm.toFixed(1)} km away</p>
                ) : (
                  <p className="mt-3 text-xs text-zinc-500">Pin your location to sort by distance.</p>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
