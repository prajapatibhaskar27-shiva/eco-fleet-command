"use client";

import { motion } from "framer-motion";
import {
  shipCargoBookings, seaPorts, cargoTypeLabels, cargoStatusLabels,
  type ShipCargoBooking,
} from "@/data/demo";
import {
  Ship, MapPin, Clock, Fuel, Leaf, Anchor, Package, Eye, ArrowRight,
  TrendingUp, Thermometer, Weight, Timer,
} from "lucide-react";

function ShipCargoRouteSVG({ booking }: { booking: ShipCargoBooking }) {
  const origin = seaPorts.find((p) => p.name === booking.originPort);
  const dest = seaPorts.find((p) => p.name === booking.destinationPort);
  if (!origin || !dest) return null;

  const cx = Math.min(origin.mapX, dest.mapX) - 30;
  const cy = Math.min(origin.mapY, dest.mapY) - 20;
  const w = Math.abs(dest.mapX - origin.mapX) + 60;
  const h = Math.abs(dest.mapY - origin.mapY) + 40;

  const mx = (origin.mapX + dest.mapX) / 2;
  const my = Math.min(origin.mapY, dest.mapY) - 15;

  return (
    <svg viewBox={`${cx} ${cy} ${w} ${h}`} className="w-full h-20" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`route-${booking.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16B364" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d={`M ${origin.mapX} ${origin.mapY} Q ${mx} ${my} ${dest.mapX} ${dest.mapY}`} fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 3" />
      {booking.progress > 0 && (
        <path d={`M ${origin.mapX} ${origin.mapY} Q ${mx} ${my} ${dest.mapX} ${dest.mapY}`} fill="none" stroke={`url(#route-${booking.id})`} strokeWidth="2.5" strokeDasharray={`${booking.progress * 0.5} 500`} />
      )}
      <circle cx={origin.mapX} cy={origin.mapY} r={3.5} fill="#16B364" />
      <circle cx={dest.mapX} cy={dest.mapY} r={3.5} fill="#f59e0b" />
      <text x={origin.mapX} y={origin.mapY - 6} textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="system-ui">{booking.originPort.split(" ")[0]}</text>
      <text x={dest.mapX} y={dest.mapY - 6} textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="system-ui">{booking.destinationPort.split(" ")[0]}</text>
    </svg>
  );
}

export function ShipCargoList({ onSelect }: { onSelect?: (b: ShipCargoBooking) => void }) {
  return (
    <div className="space-y-3">
      {shipCargoBookings.map((booking, i) => (
        <ShipCargoCard key={booking.id} booking={booking} index={i} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function ShipCargoCard({
  booking,
  index = 0,
  compact = false,
  onSelect,
}: {
  booking: ShipCargoBooking;
  index?: number;
  compact?: boolean;
  onSelect?: (b: ShipCargoBooking) => void;
}) {
  const statusInfo = cargoStatusLabels[booking.status];
  const cargoInfo = cargoTypeLabels[booking.cargoType];

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer"
        onClick={() => onSelect?.(booking)}
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <Ship className="w-4.5 h-4.5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono font-semibold text-gray-900">{booking.id}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{booking.originPort} → {booking.destinationPort}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] font-semibold text-gray-900">{booking.cargoWeight.toLocaleString()} t</p>
          <p className="text-[10px] text-gray-400">{cargoInfo.icon} {cargoInfo.label}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:shadow-gray-100 transition-all"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Ship className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-gray-900">{booking.vesselName}</h3>
              <p className="text-[11px] text-gray-400">{booking.vesselType} · {booking.id}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
      </div>

      {/* Route Map */}
      <div className="px-5 py-3 bg-gray-50/50">
        <ShipCargoRouteSVG booking={booking} />
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-3">
        {/* Route */}
        <div className="flex items-center gap-2 text-[12px]">
          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-gray-600">{booking.originPort}</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <span className="text-gray-900 font-medium">{booking.destinationPort}</span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Voyage Progress</span>
            <span className="text-[12px] font-bold text-emerald-600">{booking.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${booking.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Cargo Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-1 mb-1">
              <Package className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] text-gray-400 uppercase tracking-wider">Cargo</span>
            </div>
            <p className="text-[13px] font-bold text-gray-900">{booking.cargoWeight.toLocaleString()} t</p>
            <p className="text-[10px] text-gray-400">{cargoInfo.icon} {cargoInfo.label}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] text-gray-400 uppercase tracking-wider">ETA</span>
            </div>
            <p className="text-[13px] font-bold text-gray-900">{booking.travelDays}d</p>
            <p className="text-[10px] text-gray-400">{booking.distance.toLocaleString()} km</p>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-1 mb-1">
              <Fuel className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] text-gray-400 uppercase tracking-wider">Fuel</span>
            </div>
            <p className="text-[13px] font-bold text-gray-900">{booking.fuelUsage} t</p>
            <p className="text-[10px] text-gray-400">{Math.round(booking.fuelUsage / booking.distance * 1000)} kg/km</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-1 mb-1">
              <Leaf className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] text-emerald-600 uppercase tracking-wider">Eco</span>
            </div>
            <p className="text-[13px] font-bold text-emerald-700">{booking.co2Saved} kg</p>
            <p className="text-[10px] text-emerald-600">CO₂ saved</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><Anchor className="w-3 h-3" />Capacity: {(booking.capacity / 1000).toFixed(0)}k t</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{booking.utilization}% utilized</span>
          </div>
          <p className="text-[13px] font-bold text-gray-900">${booking.cost.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}
