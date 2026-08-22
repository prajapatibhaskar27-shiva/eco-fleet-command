"use client";

import { useState, useEffect } from "react";
import { bookings, type Booking } from "@/data/demo";

interface ShipmentMapProps {
  onSelectBooking: (b: Booking) => void;
  selectedBookingId: string | null;
}

const cityCoords: Record<string, { x: number; y: number }> = {
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

function getCoord(city: string) { return cityCoords[city] || { x: 50, y: 50 }; }

const statusColors: Record<string, string> = {
  "in-transit": "#3b82f6", confirmed: "#f59e0b", pending: "#94a3b8", delivered: "#16B364", cancelled: "#9ca3af",
};

export default function ShipmentMap({ onSelectBooking, selectedBookingId }: ShipmentMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick((t) => t + 1), 2500); return () => clearInterval(i); }, []);

  const activeBookings = bookings.filter((b) => b.status === "in-transit" || b.status === "confirmed");

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
      {/* Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="5%" height="5%" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#16B36410" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>
      </div>

      {/* SVG */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="mapGlow"><feGaussianBlur stdDeviation="0.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {activeBookings.map((booking) => {
          const from = getCoord(booking.origin);
          const to = getCoord(booking.destination);
          const midX = (from.x + to.x) / 2;
          const midY = Math.min(from.y, to.y) - 8;
          const color = statusColors[booking.status] || "#94a3b8";
          const isSelected = selectedBookingId === booking.id;
          const isHovered = hoveredId === booking.id;
          const progress = ((tick * 0.15 + from.x * 0.01) % 1);
          const t = progress;
          const dotX = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
          const dotY = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y;

          return (
            <g key={booking.id} className="cursor-pointer" onClick={() => onSelectBooking(booking)} onMouseEnter={() => setHoveredId(booking.id)} onMouseLeave={() => setHoveredId(null)}>
              <path d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`} fill="none" stroke={color} strokeWidth={isSelected ? 0.6 : 0.3} opacity={isSelected || isHovered ? 0.5 : 0.2} filter="url(#mapGlow)" />
              <path d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`} fill="none" stroke={color} strokeWidth={isSelected ? 0.3 : 0.15} opacity={isSelected || isHovered ? 0.7 : 0.3} strokeDasharray="1.5 1">
                <animate attributeName="stroke-dashoffset" from="0" to="-5" dur="3s" repeatCount="indefinite" />
              </path>
              <circle cx={from.x} cy={from.y} r={isSelected || isHovered ? 0.7 : 0.4} fill={color} opacity="0.6" />
              <circle cx={to.x} cy={to.y} r={isSelected || isHovered ? 0.7 : 0.4} fill={color} opacity="0.4" />
              {booking.status === "in-transit" && (
                <g>
                  <circle cx={dotX} cy={dotY} r={isSelected ? 1 : 0.7} fill={color} filter="url(#mapGlow)" opacity="0.8" />
                  <circle cx={dotX} cy={dotY} r={isSelected ? 2.5 : 1.8} fill="none" stroke={color} strokeWidth="0.12" opacity="0.3">
                    <animate attributeName="r" values={`${isSelected ? 1 : 0.7};${isSelected ? 3.5 : 3}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
              {(isSelected || isHovered) && (
                <g>
                  <rect x={Math.min(from.x, to.x) - 2} y={Math.min(from.y, to.y) - 7} width="22" height="4" rx="0.6" fill="white" stroke={color} strokeWidth="0.12" filter="url(#mapGlow)" />
                  <text x={Math.min(from.x, to.x) + 9} y={Math.min(from.y, to.y) - 5.2} textAnchor="middle" fill="#0f172a" fontSize="1.4" fontFamily="monospace" fontWeight="700">{booking.id}</text>
                  <text x={Math.min(from.x, to.x) + 9} y={Math.min(from.y, to.y) - 3.8} textAnchor="middle" fill={color} fontSize="0.9" fontFamily="system-ui">{booking.serviceName} · {booking.status}</text>
                </g>
              )}
            </g>
          );
        })}
        {Object.entries(cityCoords).filter(([city]) => bookings.some((b) => b.origin === city || b.destination === city)).map(([city, pos]) => (
          <text key={city} x={pos.x} y={pos.y + 2.5} textAnchor="middle" fill="rgba(0,0,0,0.15)" fontSize="0.8" fontFamily="system-ui">{city.split(",")[0]}</text>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 text-[10px]">
        {[{ label: "In Transit", color: "#3b82f6" }, { label: "Confirmed", color: "#f59e0b" }, { label: "Delivered", color: "#16B364" }].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1 border border-gray-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Live */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-200 shadow-sm">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
        <span className="text-[11px] text-emerald-600 font-semibold tracking-wide">LIVE</span>
      </div>

      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1.5 border border-gray-200 shadow-sm">
        <span className="text-[11px] text-gray-500"><span className="text-gray-900 font-semibold">{activeBookings.length}</span> active shipments</span>
      </div>
    </div>
  );
}
