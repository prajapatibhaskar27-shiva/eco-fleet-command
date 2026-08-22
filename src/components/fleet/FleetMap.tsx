"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { bookings, type Booking } from "@/data/demo";
import { loadGoogleMaps, hasGoogleMapsKey } from "@/lib/googleMaps";
import {
  Truck, MapPin, Clock, Leaf, Package, Navigation,
  RotateCcw, Search, ChevronRight, X, Eye,
} from "lucide-react";

/* ── City coordinates ───────────────────────────────────────────────────── */
const cityCoords: Record<string, google.maps.LatLngLiteral> = {
  "San Francisco, CA":  { lat: 37.7749, lng: -122.4194 },
  "Portland, OR":       { lat: 45.5152, lng: -122.6784 },
  "Austin, TX":         { lat: 30.2672, lng: -97.7431 },
  "Denver, CO":         { lat: 39.7392, lng: -104.9903 },
  "Seattle, WA":        { lat: 47.6062, lng: -122.3321 },
  "Los Angeles, CA":    { lat: 34.0522, lng: -118.2437 },
  "Phoenix, AZ":        { lat: 33.4484, lng: -112.0740 },
  "New York, NY":       { lat: 40.7128, lng: -74.0060 },
  "Boston, MA":         { lat: 42.3601, lng: -71.0589 },
  "Chicago, IL":        { lat: 41.8781, lng: -87.6298 },
  "Minneapolis, MN":    { lat: 44.9778, lng: -93.2650 },
  "Salt Lake City, UT": { lat: 40.7608, lng: -111.8910 },
  "Boise, ID":          { lat: 43.6150, lng: -116.2023 },
  "Houston, TX":        { lat: 29.7604, lng: -95.3698 },
  "Dallas, TX":         { lat: 32.7767, lng: -96.7970 },
  "Miami, FL":          { lat: 25.7617, lng: -80.1918 },
  "Orlando, FL":        { lat: 28.5383, lng: -81.3792 },
  "San Jose, CA":       { lat: 37.3382, lng: -121.8863 },
  "Sacramento, CA":     { lat: 38.5816, lng: -121.4944 },
};

function getLatLng(city: string): google.maps.LatLngLiteral {
  return cityCoords[city] || { lat: 39.8283, lng: -98.5795 };
}

/* ── Status helpers ─────────────────────────────────────────────────────── */
const statusColors: Record<string, string> = {
  "in-transit": "#16B364",
  confirmed:    "#16B364",
  pending:      "#94a3b8",
  delivered:    "#16B364",
  cancelled:    "#9ca3af",
};

const statusBg: Record<string, string> = {
  "in-transit": "bg-emerald-50 text-emerald-700 border-emerald-200",
  confirmed:    "bg-amber-50 text-amber-700 border-amber-200",
  pending:      "bg-gray-50 text-gray-500 border-gray-200",
  delivered:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:    "bg-gray-50 text-gray-400 border-gray-200",
};

/* ── SVG green marker icon for Google Maps ──────────────────────────────── */
function createGreenMarkerIcon(status: string, isSelected: boolean): google.maps.Icon {
  const color = statusColors[status] || "#94a3b8";
  const size = isSelected ? 40 : 32;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="${color}" stroke="white" stroke-width="1.5" opacity="${isSelected ? 1 : 0.85}"/>
    <circle cx="12" cy="9" r="3" fill="white" opacity="0.9"/>
    ${status === "in-transit" ? `<circle cx="12" cy="9" r="1.5" fill="${color}"/>` : ""}
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size),
  };
}

function createDestMarkerIcon(): google.maps.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill="white" stroke="#16B364" stroke-width="2.5"/>
    <circle cx="12" cy="12" r="3" fill="#16B364"/>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(28, 28),
    anchor: new google.maps.Point(14, 14),
  };
}

/* ── Fallback SVG map (when no API key) ─────────────────────────────────── */
function FallbackMap({ onSelectBooking, selectedBookingId }: {
  onSelectBooking: (b: Booking) => void;
  selectedBookingId: string | null;
}) {
  const svgCoords: Record<string, { x: number; y: number }> = {
    "San Francisco, CA": { x: 15, y: 42 }, "Portland, OR": { x: 18, y: 15 },
    "Austin, TX": { x: 48, y: 72 }, "Denver, CO": { x: 38, y: 38 },
    "Seattle, WA": { x: 16, y: 10 }, "Los Angeles, CA": { x: 22, y: 58 },
    "Phoenix, AZ": { x: 30, y: 62 }, "New York, NY": { x: 82, y: 30 },
    "Boston, MA": { x: 88, y: 22 }, "Chicago, IL": { x: 62, y: 28 },
    "Minneapolis, MN": { x: 52, y: 15 }, "Salt Lake City, UT": { x: 28, y: 35 },
    "Boise, ID": { x: 22, y: 22 }, "Houston, TX": { x: 52, y: 75 },
    "Dallas, TX": { x: 50, y: 68 }, "Miami, FL": { x: 80, y: 82 },
    "Orlando, FL": { x: 78, y: 76 }, "San Jose, CA": { x: 14, y: 46 },
    "Sacramento, CA": { x: 16, y: 38 },
  };
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick((t) => t + 1), 2500); return () => clearInterval(i); }, []);
  const active = bookings.filter((b) => b.status === "in-transit" || b.status === "confirmed");

  return (
    <div className="absolute inset-0 bg-gray-50">
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%"><defs><pattern id="g" width="5%" height="5%" patternUnits="userSpaceOnUse"><path d="M50 0L0 0 0 50" fill="none" stroke="#16B36410" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#g)" /></svg>
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="glow"><feGaussianBlur stdDeviation="0.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {active.map((b) => {
          const from = svgCoords[b.origin] || { x: 50, y: 50 };
          const to = svgCoords[b.destination] || { x: 50, y: 50 };
          const mx = (from.x + to.x) / 2, my = Math.min(from.y, to.y) - 8;
          const isSel = selectedBookingId === b.id;
          const t = ((tick * 0.15 + from.x * 0.01) % 1);
          const dx = (1-t)*(1-t)*from.x + 2*(1-t)*t*mx + t*t*to.x;
          const dy = (1-t)*(1-t)*from.y + 2*(1-t)*t*my + t*t*to.y;
          return (
            <g key={b.id} className="cursor-pointer" onClick={() => onSelectBooking(b)}>
              <path d={`M${from.x} ${from.y} Q${mx} ${my} ${to.x} ${to.y}`} fill="none" stroke="#16B364" strokeWidth={isSel ? 0.6 : 0.3} opacity={isSel ? 0.5 : 0.2} filter="url(#glow)" />
              <path d={`M${from.x} ${from.y} Q${mx} ${my} ${to.x} ${to.y}`} fill="none" stroke="#16B364" strokeWidth={isSel ? 0.3 : 0.15} opacity={isSel ? 0.7 : 0.3} strokeDasharray="1.5 1"><animate attributeName="stroke-dashoffset" from="0" to="-5" dur="3s" repeatCount="indefinite" /></path>
              <circle cx={from.x} cy={from.y} r={isSel ? 0.7 : 0.4} fill="#16B364" opacity="0.6" />
              <circle cx={to.x} cy={to.y} r={isSel ? 0.7 : 0.4} fill="#16B364" opacity="0.4" />
              {b.status === "in-transit" && (<><circle cx={dx} cy={dy} r={isSel ? 1 : 0.7} fill="#16B364" filter="url(#glow)" opacity="0.8" /><circle cx={dx} cy={dy} r={isSel ? 2.5 : 1.8} fill="none" stroke="#16B364" strokeWidth="0.12" opacity="0.3"><animate attributeName="r" values={`${isSel ? 1 : 0.7};${isSel ? 3.5 : 3}`} dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" /></circle></>)}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
interface ShipmentMapProps {
  onSelectBooking: (b: Booking) => void;
  selectedBookingId: string | null;
}

export default function ShipmentMap({ onSelectBooking, selectedBookingId }: ShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>(null as unknown as google.maps.Marker[]);
  const polylinesRef = useRef<google.maps.Polyline[]>(null as unknown as google.maps.Polyline[]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [trackLive, setTrackLive] = useState(false);
  const [liveTick, setLiveTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<Booking | null>(null);

  const hasKey = hasGoogleMapsKey();
  const activeBookings = bookings.filter((b) => b.status === "in-transit" || b.status === "confirmed");

  /* Load Google Maps */
  useEffect(() => {
    if (!hasKey) { setLoadError(true); return; }
    loadGoogleMaps()
      .then(() => {
        if (!mapRef.current) return;
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "labels", stylers: [{ visibility: "simplified" }] },
          ],
          mapId: "eco-fleet-command",
        });
        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        setMapReady(true);
      })
      .catch(() => setLoadError(true));
  }, [hasKey]);

  /* Fit bounds to active bookings */
  const fitBounds = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = new google.maps.LatLngBounds();
    activeBookings.forEach((b) => {
      bounds.extend(getLatLng(b.origin));
      bounds.extend(getLatLng(b.destination));
    });
    if (!bounds.isEmpty()) map.fitBounds(bounds, 60);
  }, [activeBookings]);

  useEffect(() => { if (mapReady) fitBounds(); }, [mapReady, fitBounds]);

  /* Draw markers and polylines */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clear old markers and polylines
    const oldMarkers = markersRef.current;
    const oldPolylines = polylinesRef.current;
    oldMarkers.forEach((m) => m.setMap(null));
    oldPolylines.forEach((p) => p.setMap(null));
    const newMarkers: google.maps.Marker[] = [];
    const newPolylines: google.maps.Polyline[] = [];

    activeBookings.forEach((booking) => {
      const origin = getLatLng(booking.origin);
      const dest = getLatLng(booking.destination);
      const isSelected = selectedBookingId === booking.id;

      // Route polyline
      const routePath = [origin, dest];
      const polyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: "#16B364",
        strokeOpacity: isSelected ? 0.8 : 0.4,
        strokeWeight: isSelected ? 3 : 2,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: isSelected ? 4 : 3,
            fillColor: "#16B364",
            fillOpacity: 0.6,
            strokeOpacity: 0,
          },
          offset: "100%",
        }],
        map,
      });
      polyline.addListener("click", () => onSelectBooking(booking));
      newPolylines.push(polyline);

      // Origin marker
      const originMarker = new google.maps.Marker({
        position: origin,
        map,
        icon: createGreenMarkerIcon(booking.status, isSelected),
        title: `${booking.id} — ${booking.origin}`,
      });
      originMarker.addListener("click", () => {
        setSelectedInfo(booking);
        showInfoWindow(origin, booking);
      });
      newMarkers.push(originMarker);

      // Destination marker
      const destMarker = new google.maps.Marker({
        position: dest,
        map,
        icon: createDestMarkerIcon(),
        title: `Destination: ${booking.destination}`,
      });
      destMarker.addListener("click", () => showInfoWindow(dest, booking));
      newMarkers.push(destMarker);
    });
    markersRef.current = newMarkers;
    polylinesRef.current = newPolylines;
  }, [activeBookings, selectedBookingId, mapReady, onSelectBooking]);

  /* Info window */
  const showInfoWindow = (position: google.maps.LatLngLiteral, booking: Booking) => {
    const map = mapInstanceRef.current;
    const iw = infoWindowRef.current;
    if (!map || !iw) return;

    const statusCls = statusBg[booking.status] || "bg-gray-50 text-gray-500 border-gray-200";
    iw.setContent(`
      <div style="min-width:260px;max-width:320px;font-family:system-ui,-apple-system,sans-serif;padding:0;">
        <div style="padding:16px 16px 12px;border-bottom:1px solid #f1f5f9;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:15px;font-weight:700;color:#0f172a;">${booking.id}</span>
            <span style="font-size:10px;padding:2px 8px;border-radius:9999px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
              background:${booking.status === "in-transit" ? "#ecfdf5" : booking.status === "confirmed" ? "#fffbeb" : "#f8fafc"};
              color:${booking.status === "in-transit" ? "#059669" : booking.status === "confirmed" ? "#d97706" : "#64748b"};
              border:1px solid ${booking.status === "in-transit" ? "#d1fae5" : booking.status === "confirmed" ? "#fef3c7" : "#e2e8f0"};">
              ${booking.status}
            </span>
          </div>
          <span style="font-size:12px;color:#64748b;">${booking.serviceName}</span>
        </div>
        <div style="padding:12px 16px;">
          <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
            <div style="width:6px;height:6px;border-radius:50%;background:#16B364;margin-top:5px;flex-shrink:0;"></div>
            <div>
              <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Origin</div>
              <div style="font-size:13px;color:#0f172a;font-weight:500;">${booking.origin}</div>
            </div>
          </div>
          <div style="width:1px;height:16px;background:#e2e8f0;margin-left:2px;margin-bottom:8px;"></div>
          <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:12px;">
            <div style="width:6px;height:6px;border-radius:50%;background:#f59e0b;margin-top:5px;flex-shrink:0;"></div>
            <div>
              <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Destination</div>
              <div style="font-size:13px;color:#0f172a;font-weight:500;">${booking.destination}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:10px;border-top:1px solid #f1f5f9;">
            <div>
              <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">ETA</div>
              <div style="font-size:13px;color:#0f172a;font-weight:600;">${booking.estimatedDelivery}</div>
            </div>
            <div>
              <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">CO₂ Saved</div>
              <div style="font-size:13px;color:#059669;font-weight:600;">${booking.co2Saved} kg</div>
            </div>
            <div>
              <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Weight</div>
              <div style="font-size:13px;color:#0f172a;font-weight:600;">${booking.weight} kg</div>
            </div>
            <div>
              <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Cost</div>
              <div style="font-size:13px;color:#0f172a;font-weight:600;">$${booking.cost.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div style="padding:8px 16px 14px;">
          <button onclick="window.__ecoFleetSelectBooking('${booking.id}')" style="width:100%;padding:8px 0;border:none;border-radius:8px;background:#16B364;color:white;font-size:12px;font-weight:600;cursor:pointer;transition:background 0.15s;">
            View Full Details →
          </button>
        </div>
      </div>
    `);
    iw.setPosition(position);
    iw.open(map);
  };

  /* Track Live simulation */
  useEffect(() => {
    if (!trackLive) return;
    const interval = setInterval(() => setLiveTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, [trackLive]);

  /* Search */
  const handleSearch = () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    const match = bookings.find(
      (b) =>
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      onSelectBooking(match);
      const pos = getLatLng(match.origin);
      mapInstanceRef.current.panTo(pos);
      mapInstanceRef.current.setZoom(6);
    }
  };

  /* Expose booking selection to info window button clicks */
  useEffect(() => {
    (window as any).__ecoFleetSelectBooking = (id: string) => {
      const b = bookings.find((bk) => bk.id === id);
      if (b) onSelectBooking(b);
    };
    return () => { delete (window as any).__ecoFleetSelectBooking; };
  }, [onSelectBooking]);

  /* Sidebar list */
  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 bg-white flex flex-col lg:flex-row">
      {/* Map area */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        {/* Search bar */}
        <div className="absolute top-4 left-4 right-16 z-10 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search booking, city, or route..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold hover:bg-emerald-600 shadow-sm transition-all"
          >
            Search
          </button>
        </div>

        {/* Track Live button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => { setTrackLive(!trackLive); if (!trackLive) setLiveTick(0); }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold border shadow-sm transition-all ${
              trackLive
                ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-200"
                : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
            }`}
          >
            {trackLive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Tracking Live
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Track Live
              </>
            )}
          </button>
        </div>

        {/* Google Map or Fallback */}
        {hasKey && !loadError ? (
          <div ref={mapRef} className="w-full h-full min-h-[400px] lg:min-h-[500px]" />
        ) : (
          <FallbackMap onSelectBooking={onSelectBooking} selectedBookingId={selectedBookingId} />
        )}

        {/* Live indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-200 shadow-sm z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold tracking-wide">
            {trackLive ? `LIVE · Update #${liveTick}` : "LIVE"}
          </span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 flex flex-wrap gap-1.5 z-10">
          {[
            { label: "In Transit", color: "#16B364" },
            { label: "Confirmed", color: "#f59e0b" },
            { label: "Delivered", color: "#16B364" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1 border border-gray-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* No API key notice */}
        {loadError && (
          <div className="absolute bottom-16 left-4 right-4 z-20 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-[12px] text-amber-700">
            <span className="font-semibold">Google Maps API key not found.</span> Add{" "}
            <code className="bg-amber-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your{" "}
            <code className="bg-amber-100 px-1 rounded">.env.local</code> file to enable the full interactive map.
          </div>
        )}
      </div>

      {/* Sidebar — shipment list */}
      <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            Active Shipments
            <span className="ml-auto text-[11px] text-gray-400 font-normal">{activeBookings.length} tracked</span>
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeBookings.map((booking) => {
            const isSelected = selectedBookingId === booking.id;
            return (
              <button
                key={booking.id}
                onClick={() => {
                  onSelectBooking(booking);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.panTo(getLatLng(booking.origin));
                    mapInstanceRef.current.setZoom(6);
                  }
                }}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-all hover:bg-gray-50 ${
                  isSelected ? "bg-emerald-50/50 border-l-2 border-l-emerald-500" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-mono font-semibold text-gray-900">{booking.id}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide border ${statusBg[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {booking.origin}
                  <ChevronRight className="w-3 h-3 text-gray-300 mx-0.5" />
                  {booking.destination}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />ETA {booking.estimatedDelivery}</span>
                  <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-500" />{booking.co2Saved} kg</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected booking detail */}
        {selectedBooking && (
          <div className="border-t border-gray-100 p-4 bg-emerald-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-gray-900">{selectedBooking.id} Details</span>
              <button onClick={() => onSelectBooking(selectedBooking)} className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold">
                Full View →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-gray-400">Service</span><p className="font-medium text-gray-700">{selectedBooking.serviceName}</p></div>
              <div><span className="text-gray-400">Weight</span><p className="font-medium text-gray-700">{selectedBooking.weight} kg</p></div>
              <div><span className="text-gray-400">Cost</span><p className="font-medium text-gray-700">${selectedBooking.cost.toFixed(2)}</p></div>
              <div><span className="text-gray-400">Items</span><p className="font-medium text-gray-700">{selectedBooking.items}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
