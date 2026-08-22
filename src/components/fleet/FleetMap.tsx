"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookings, type Booking } from "@/data/demo";
import { MapPin, Package, ArrowRight } from "lucide-react";

interface ShipmentMapProps {
  onSelectBooking: (b: Booking) => void;
  selectedBookingId: string | null;
}

// City coordinate lookup for rendering routes
const cityCoords: Record<string, { x: number; y: number }> = {
  "San Francisco, CA": { x: 15, y: 42 },
  "Portland, OR": { x: 18, y: 15 },
  "Austin, TX": { x: 48, y: 72 },
  "Denver, CO": { x: 38, y: 38 },
  "Seattle, WA": { x: 16, y: 10 },
  "Los Angeles, CA": { x: 22, y: 58 },
  "Phoenix, AZ": { x: 30, y: 62 },
  "New York, NY": { x: 82, y: 30 },
  "Boston, MA": { x: 88, y: 22 },
  "Chicago, IL": { x: 62, y: 28 },
  "Minneapolis, MN": { x: 52, y: 15 },
  "Salt Lake City, UT": { x: 28, y: 35 },
  "Boise, ID": { x: 22, y: 22 },
  "Houston, TX": { x: 52, y: 75 },
  "Dallas, TX": { x: 50, y: 68 },
  "Miami, FL": { x: 80, y: 82 },
  "Orlando, FL": { x: 78, y: 76 },
  "San Jose, CA": { x: 14, y: 46 },
  "Sacramento, CA": { x: 16, y: 38 },
};

function getCoord(city: string) {
  return cityCoords[city] || { x: 50, y: 50 };
}

const statusColors: Record<string, string> = {
  "in-transit": "#3b82f6",
  confirmed: "#f59e0b",
  pending: "#94a3b8",
  delivered: "#10b981",
  cancelled: "#6b7280",
};

export default function ShipmentMap({ onSelectBooking, selectedBookingId }: ShipmentMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(interval);
  }, []);

  const activeBookings = bookings.filter((b) => b.status === "in-transit" || b.status === "confirmed");

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-emerald-500/20 bg-[#080f1e]">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="5%" height="5%" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.06)_0%,_transparent_70%)]" />

      {/* SVG overlay */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw routes for each active booking */}
        {activeBookings.map((booking) => {
          const from = getCoord(booking.origin);
          const to = getCoord(booking.destination);
          const midX = (from.x + to.x) / 2;
          const midY = Math.min(from.y, to.y) - 8;
          const color = statusColors[booking.status] || "#94a3b8";
          const isSelected = selectedBookingId === booking.id;
          const isHovered = hoveredId === booking.id;

          // Animate the dot position along the path
          const progress = ((tick * 0.15 + from.x * 0.01) % 1);
          const t = progress;
          const dotX = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
          const dotY = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y;

          return (
            <g key={booking.id} className="cursor-pointer" onClick={() => onSelectBooking(booking)} onMouseEnter={() => setHoveredId(booking.id)} onMouseLeave={() => setHoveredId(null)}>
              {/* Route glow */}
              <path d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`} fill="none" stroke={color} strokeWidth={isSelected ? 0.8 : 0.4} opacity={isSelected || isHovered ? 0.5 : 0.15} filter="url(#glow)" />

              {/* Route line */}
              <path d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`} fill="none" stroke={color} strokeWidth={isSelected ? 0.4 : 0.2} opacity={isSelected || isHovered ? 0.8 : 0.3} strokeDasharray="1.5 1">
                <animate attributeName="stroke-dashoffset" from="0" to="-5" dur="3s" repeatCount="indefinite" />
              </path>

              {/* Origin dot */}
              <circle cx={from.x} cy={from.y} r={isSelected || isHovered ? 0.8 : 0.5} fill={color} opacity="0.6" />

              {/* Destination dot */}
              <circle cx={to.x} cy={to.y} r={isSelected || isHovered ? 0.8 : 0.5} fill={color} opacity="0.4" />

              {/* Moving package dot */}
              {booking.status === "in-transit" && (
                <g>
                  <circle cx={dotX} cy={dotY} r={isSelected ? 1.2 : 0.8} fill={color} filter="url(#glow-strong)" opacity="0.8" />
                  <circle cx={dotX} cy={dotY} r={isSelected ? 2.5 : 1.8} fill="none" stroke={color} strokeWidth="0.15" opacity="0.3">
                    <animate attributeName="r" values={`${isSelected ? 1.2 : 0.8};${isSelected ? 3.5 : 3}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Tooltip */}
              {(isSelected || isHovered) && (
                <g>
                  <rect x={Math.min(from.x, to.x) - 2} y={Math.min(from.y, to.y) - 7} width="22" height="4" rx="0.6" fill="rgba(0,0,0,0.88)" stroke={color} strokeWidth="0.12" />
                  <text x={Math.min(from.x, to.x) + 9} y={Math.min(from.y, to.y) - 5.2} textAnchor="middle" fill="white" fontSize="1.4" fontFamily="monospace" fontWeight="700">
                    {booking.id}
                  </text>
                  <text x={Math.min(from.x, to.x) + 9} y={Math.min(from.y, to.y) - 3.8} textAnchor="middle" fill={color} fontSize="0.9" fontFamily="system-ui">
                    {booking.serviceName} · {booking.status}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* City labels for key hubs */}
        {Object.entries(cityCoords).filter(([city]) =>
          bookings.some((b) => b.origin === city || b.destination === city)
        ).map(([city, pos]) => (
          <text key={city} x={pos.x} y={pos.y + 2.5} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="0.8" fontFamily="system-ui">
            {city.split(",")[0]}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 text-[10px]">
        {[
          { label: "In Transit", color: "#3b82f6" },
          { label: "Confirmed", color: "#f59e0b" },
          { label: "Delivered", color: "#10b981" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span style={{ color: item.color }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-emerald-500/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] text-emerald-400 font-medium tracking-wide">LIVE</span>
      </div>

      {/* Active count */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
        <span className="text-[11px] text-muted-foreground">
          <span className="text-foreground font-semibold">{activeBookings.length}</span> active shipments
        </span>
      </div>
    </div>
  );
}
