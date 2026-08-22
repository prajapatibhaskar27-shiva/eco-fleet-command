"use client";

import { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { bookings, mapLocations, shipCargoBookings, type Booking, type MapLocation } from "@/data/demo";
import {
  Truck, MapPin, Package, Search, X, Anchor, Warehouse,
} from "lucide-react";

/* ── Fix Leaflet default icon path ──────────────────────────────────────── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ── Custom SVG icons for each location type ────────────────────────────── */
function makeIcon(type: string, status: string, isSelected: boolean): L.DivIcon {
  const colors: Record<string, { bg: string; fg: string; emoji: string }> = {
    truck:     { bg: "#16B364", fg: "#fff", emoji: "🚚" },
    ship:      { bg: "#0284c7", fg: "#fff", emoji: "🚢" },
    warehouse: { bg: "#7c3aed", fg: "#fff", emoji: "🏭" },
    port:      { bg: "#0891b2", fg: "#fff", emoji: "⚓" },
    pickup:    { bg: "#16B364", fg: "#fff", emoji: "📍" },
    delivery:  { bg: "#f59e0b", fg: "#fff", emoji: "🏁" },
  };
  const c = colors[type] || { bg: "#6b7280", fg: "#fff", emoji: "•" };
  const size = isSelected ? 40 : 32;
  const pulse = status === "active" && (type === "truck" || type === "ship");
  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${pulse ? `<div style="position:absolute;inset:-4px;border-radius:50%;background:${c.bg};opacity:0.25;animation:pulse 2s ease-in-out infinite;"></div>` : ""}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${c.bg};display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:${size * 0.45}px;">
          ${c.emoji}
        </div>
      </div>
    `,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/* ── Auto-fit bounds helper ─────────────────────────────────────────────── */
function FitBounds({ bounds }: { bounds: L.LatLngTuple[] }) {
  const map = useMap();
  useMemo(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5, animate: true });
    }
  }, [bounds, map]);
  return null;
}

/* ── Status helpers ─────────────────────────────────────────────────────── */
const statusColors: Record<string, string> = {
  "in-transit": "bg-emerald-50 text-emerald-700 border-emerald-200",
  confirmed: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-gray-50 text-gray-500 border-gray-200",
  delivered: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-gray-50 text-gray-400 border-gray-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  idle: "bg-gray-50 text-gray-500 border-gray-200",
  scheduled: "bg-amber-50 text-amber-700 border-amber-200",
};

type FilterType = "all" | "truck" | "ship" | "warehouse" | "port" | "pickup" | "delivery";

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function ShipmentMap({
  onSelectBooking,
  selectedBookingId: _selectedBookingId,
}: {
  onSelectBooking?: (b: Booking) => void;
  selectedBookingId?: string | null;
}) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  // Derive route data from active bookings
  const activeBookings = bookings.filter((b) => ["in-transit", "confirmed"].includes(b.status));
  const activeCargo = shipCargoBookings.filter((c) => c.status === "in-transit");

  // City coordinates for booking routes
  const cityCoords: Record<string, [number, number]> = {
    "San Francisco, CA": [37.7749, -122.4194], "Portland, OR": [45.5152, -122.6784],
    "Austin, TX": [30.2672, -97.7431], "Denver, CO": [39.7392, -104.9903],
    "Seattle, WA": [47.6062, -122.3321], "Los Angeles, CA": [34.0522, -118.2437],
    "Phoenix, AZ": [33.4484, -112.074], "New York, NY": [40.7128, -74.006],
    "Boston, MA": [42.3601, -71.0589], "Chicago, IL": [41.8781, -87.6298],
    "Miami, FL": [25.7617, -80.1918], "Orlando, FL": [28.5383, -81.3792],
    "Salt Lake City, UT": [40.7608, -111.891], "Boise, ID": [43.615, -116.2023],
  };

  const getRoute = useCallback((b: Booking): [number, number][] => {
    const o = cityCoords[b.origin];
    const d = cityCoords[b.destination];
    if (o && d) return [o, d];
    return [];
  }, []);

  const filteredLocations = useMemo(() => {
    let locs = mapLocations;
    if (filter !== "all") locs = locs.filter((l) => l.type === filter);
    if (search) {
      const q = search.toLowerCase();
      locs = locs.filter((l) => l.name.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q) || l.type.includes(q));
    }
    return locs;
  }, [filter, search]);

  // Fit bounds for all filtered locations
  const bounds: L.LatLngTuple[] = useMemo(() => {
    const pts: L.LatLngTuple[] = filteredLocations.map((l) => [l.lat, l.lng]);
    activeBookings.forEach((b) => {
      const r = getRoute(b);
      r.forEach((p) => pts.push([p[0], p[1]]));
    });
    return pts;
  }, [filteredLocations, activeBookings, getRoute]);

  const filters: { key: FilterType; label: string; icon: string; count: number }[] = [
    { key: "all", label: "All", icon: "🌐", count: mapLocations.length },
    { key: "truck", label: "Trucks", icon: "🚚", count: mapLocations.filter((l) => l.type === "truck").length },
    { key: "ship", label: "Ships", icon: "🚢", count: mapLocations.filter((l) => l.type === "ship").length },
    { key: "warehouse", label: "Warehouses", icon: "🏭", count: mapLocations.filter((l) => l.type === "warehouse").length },
    { key: "port", label: "Ports", icon: "⚓", count: mapLocations.filter((l) => l.type === "port").length },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1a1f2e] dark:border-white/[0.06] rounded-2xl border border-gray-200 overflow-hidden transition-colors duration-300">
      {/* ── Top controls ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Fleet Tracking Map</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Live locations across all shipments</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:max-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations, bookings…"
            className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] rounded-xl text-[12px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live
        </div>
      </div>

      {/* ── Filter tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-100 dark:border-white/[0.06] overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                : "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.08]"
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
            <span className="text-[10px] opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* ── Map ──────────────────────────────────────────────────────── */}
      <div className="flex-1 relative" style={{ minHeight: 400 }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%", background: "#f0faf4" }}
          zoomControl={true}
          scrollWheelZoom={true}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {bounds.length > 0 && <FitBounds bounds={bounds} />}

          {/* ── Booking routes (polylines) ──────────────────────────── */}
          {activeBookings.map((b) => {
            const route = getRoute(b);
            if (route.length < 2) return null;
            return (
              <Polyline
                key={`route-${b.id}`}
                positions={route}
                pathOptions={{ color: "#16B364", weight: 2.5, opacity: 0.6, dashArray: "8 6" }}
              />
            );
          })}

          {/* ── Ship cargo routes ───────────────────────────────────── */}
          {activeCargo.map((c) => (
            <Polyline
              key={`cargo-${c.id}`}
              positions={[[c.originLat, c.originLng], [c.destLat, c.destLng]]}
              pathOptions={{ color: "#0284c7", weight: 2, opacity: 0.5, dashArray: "6 4" }}
            />
          ))}

          {/* ── Location markers ─────────────────────────────────────── */}
          {filteredLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={makeIcon(loc.type, loc.status, selectedLocation?.id === loc.id)}
              eventHandlers={{
                click: () => setSelectedLocation(loc),
              }}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[loc.status] || "bg-gray-50 text-gray-500"}`}>
                      {loc.status}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{loc.type}</span>
                  </div>
                  <p className="text-[13px] font-bold text-gray-900">{loc.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{loc.detail}</p>
                  {loc.route && loc.route.length > 0 && (
                    <p className="text-[10px] text-emerald-600 mt-1 font-semibold">
                      🛣 {loc.route.length} waypoints on route
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* ── Booking origin markers ──────────────────────────────── */}
          {activeBookings.map((b) => {
            const o = cityCoords[b.origin];
            if (!o) return null;
            return (
              <Marker
                key={`origin-${b.id}`}
                position={o}
                icon={L.divIcon({
                  html: `<div style="width:16px;height:16px;border-radius:50%;background:#16B364;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
                  className: "",
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })}
              >
                <Popup>
                  <div className="p-1">
                    <p className="text-[12px] font-bold text-gray-900">{b.id} — {b.serviceName}</p>
                    <p className="text-[11px] text-gray-500">{b.origin} → {b.destination}</p>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[b.status]}`}>{b.status}</span>
                    {onSelectBooking && (
                      <button onClick={() => onSelectBooking(b)} className="mt-1 text-[11px] text-emerald-600 font-semibold hover:underline">
                        View details →
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── Location detail panel ────────────────────────────────────── */}
      {selectedLocation && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{selectedLocation.name}</p>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[selectedLocation.status]}`}>{selectedLocation.status}</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{selectedLocation.detail}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</p>
          </div>
          <button onClick={() => setSelectedLocation(null)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Stats footer ────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-emerald-500" /> {mapLocations.filter((l) => l.type === "truck").length} vehicles</span>
          <span className="flex items-center gap-1"><Anchor className="w-3 h-3 text-blue-500" /> {mapLocations.filter((l) => l.type === "ship").length} vessels</span>
          <span className="flex items-center gap-1"><Warehouse className="w-3 h-3 text-purple-500" /> {mapLocations.filter((l) => l.type === "warehouse").length} warehouses</span>
          <span className="flex items-center gap-1"><Package className="w-3 h-3 text-cyan-500" /> {mapLocations.filter((l) => l.type === "port").length} ports</span>
        </div>
        <span className="font-mono text-[10px]">{filteredLocations.length} / {mapLocations.length} shown</span>
      </div>
    </div>
  );
}
