import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Loader2, MapPin, Navigation, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as api from "../utils/api";

const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const darkStyle = [
  { elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#18181b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#71717a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#27272a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#09090b" }] }
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
            title: event.title
          });

          marker.addListener("click", () => {
            setSelected(event);
            infoWindowRef.current?.setContent(
              `<div style="background:#18181b;color:#f4f4f5;padding:10px 12px;border-radius:10px;min-width:180px;">
                <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${event.title}</div>
                <div style="font-size:11px;color:#a1a1aa;">${event.location}</div>
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
        new window.google.maps.Marker({
          map: mapInstance.current,
          position,
          title: "You are here"
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Explore</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Runs Near Me</h1>
          <p className="mt-2 text-sm text-zinc-400">{upcomingWithLocation.length} events with locations</p>
        </div>
        <button onClick={locateMe} disabled={geoLoading || loading || !!mapsError} className="btn-primary gap-2">
          {geoLoading ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
          {geoLoading ? "Locating..." : "Locate Me"}
        </button>
      </div>

      {geoError ? (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <AlertCircle size={15} />
          {geoError}
        </div>
      ) : null}

      {mapsError ? (
        <div className="card p-6 text-center">
          <MapPin size={30} className="mx-auto text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-400">{mapsError}</p>
          <pre className="mt-4 rounded-xl bg-zinc-950 p-4 text-left text-xs text-zinc-500">
{`# .env.local
VITE_GOOGLE_MAPS_KEY=your_key_here`}
          </pre>
        </div>
      ) : (
        <div className="relative">
          {loading ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-zinc-900">
              <Loader2 size={24} className="animate-spin text-brand-400" />
            </div>
          ) : null}
          <div ref={mapRef} className="h-[380px] w-full overflow-hidden rounded-2xl border border-zinc-800" />
        </div>
      )}

      {selected ? (
        <div className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">Selected Event</p>
              <h3 className="mt-1 font-display text-xl font-bold">{selected.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{selected.location}</p>
              <p className="mt-1 text-xs text-zinc-500">{format(new Date(selected.date), "EEE, MMM d h:mm a")}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/events/${selected._id}`)} className="btn-primary">
                View Event
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  infoWindowRef.current?.close();
                }}
                className="btn-ghost"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold">Upcoming Events with Locations</h2>
        {upcomingWithLocation.length === 0 ? (
          <div className="card p-8 text-center text-sm text-zinc-500">
            No events with location data yet. Add a location when creating events.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingWithLocation.map((event) => (
              <button
                key={event._id}
                onClick={() => setSelected(event)}
                className="card p-4 text-left transition hover:border-brand-400/30"
              >
                <p className="font-semibold text-zinc-100">{event.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{event.location}</p>
                <p className="mt-1 text-xs text-zinc-600">{format(new Date(event.date), "MMM d h:mm a")}</p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
