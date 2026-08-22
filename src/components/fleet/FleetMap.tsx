"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vehicles as demoVehicles, type Vehicle } from "@/data/demo";

interface FleetMapProps {
  onSelectVehicle: (v: Vehicle) => void;
  selectedVehicleId: string | null;
}

// Simple grid-based map with animated vehicle markers
export default function FleetMap({ onSelectVehicle, selectedVehicleId }: FleetMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // Project lat/lng to SVG coordinates (simple mercator-like projection)
  const centerLat = 40.7128;
  const centerLng = -74.006;
  const scale = 4200;

  const project = (lat: number, lng: number) => ({
    x: 50 + (lng - centerLng) * scale,
    y: 50 - (lat - centerLat) * scale,
  });

  const activeVehicles = demoVehicles.filter((v) => v.status === "active");

  // Generate animated route paths
  const routePaths = [
    "M 52 46 Q 48 38 44 32 Q 40 28 36 24",
    "M 46 52 Q 38 48 30 44 Q 22 38 18 34",
    "M 42 38 Q 48 34 52 30 Q 56 26 60 22",
    "M 58 48 Q 62 42 66 36 Q 70 30 74 24",
    "M 38 56 Q 32 50 26 44 Q 20 38 14 32",
    "M 54 54 Q 58 48 62 42 Q 66 36 70 30",
  ];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-emerald-500/20 bg-[#080f1e]">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="5%" height="5%" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)]" />

      {/* SVG overlay with routes and markers */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="route-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Route paths */}
        {routePaths.map((d, i) => (
          <g key={i}>
            {/* Glow behind */}
            <path
              d={d}
              fill="none"
              stroke="rgba(16,185,129,0.15)"
              strokeWidth="1.2"
              filter="url(#glow)"
            />
            {/* Main path */}
            <path
              d={d}
              fill="none"
              stroke="url(#route-grad)"
              strokeWidth="0.4"
              strokeDasharray="2 1"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-6"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}

        {/* Vehicle markers */}
        {activeVehicles.map((v) => {
          const pos = project(v.lat + Math.sin(tick * 0.3 + v.lat * 100) * 0.001, v.lng + Math.cos(tick * 0.2 + v.lng * 100) * 0.001);
          const isSelected = selectedVehicleId === v.id;
          const isHovered = hoveredId === v.id;
          const isEV = v.type.startsWith("ev");
          const color = isEV ? "#10b981" : "#f59e0b";

          return (
            <g
              key={v.id}
              className="cursor-pointer"
              onClick={() => onSelectVehicle(v)}
              onMouseEnter={() => setHoveredId(v.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Pulse ring */}
              <circle cx={pos.x} cy={pos.y} r={isSelected ? 3 : 2} fill="none" stroke={color} strokeWidth="0.2" opacity="0.4">
                <animate attributeName="r" values={`${isSelected ? 2 : 1.5};${isSelected ? 5 : 4}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Glow */}
              <circle cx={pos.x} cy={pos.y} r={isSelected ? 1.5 : 1} fill={color} filter="url(#glow-strong)" opacity="0.6" />

              {/* Core dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected || isHovered ? 1.2 : 0.8}
                fill={color}
                stroke={isSelected ? "#fff" : "transparent"}
                strokeWidth="0.3"
                style={{ transition: "r 0.2s" }}
              />

              {/* Label */}
              {(isSelected || isHovered) && (
                <g>
                  <rect
                    x={pos.x - 8}
                    y={pos.y - 5.5}
                    width="16"
                    height="2.8"
                    rx="0.5"
                    fill="rgba(0,0,0,0.85)"
                    stroke={color}
                    strokeWidth="0.15"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 3.8}
                    textAnchor="middle"
                    fill="white"
                    fontSize="1.4"
                    fontFamily="system-ui"
                    fontWeight="600"
                  >
                    {v.name}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y - 2.2}
                    textAnchor="middle"
                    fill={color}
                    fontSize="1"
                    fontFamily="system-ui"
                  >
                    {v.speed > 0 ? `${v.speed} km/h · ${v.eta}` : v.status}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Offline/maintenance markers (dimmer) */}
        {demoVehicles
          .filter((v) => v.status === "idle" || v.status === "maintenance" || v.status === "offline")
          .map((v) => {
            const pos = project(v.lat, v.lng);
            const color =
              v.status === "maintenance"
                ? "#f97316"
                : v.status === "offline"
                  ? "#6b7280"
                  : "#64748b";

            return (
              <g
                key={v.id}
                className="cursor-pointer"
                onClick={() => onSelectVehicle(v)}
                onMouseEnter={() => setHoveredId(v.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <circle cx={pos.x} cy={pos.y} r={0.6} fill={color} opacity="0.5" />
                {(hoveredId === v.id || selectedVehicleId === v.id) && (
                  <g>
                    <rect
                      x={pos.x - 8}
                      y={pos.y - 5.5}
                      width="16"
                      height="2.8"
                      rx="0.5"
                      fill="rgba(0,0,0,0.85)"
                      stroke={color}
                      strokeWidth="0.15"
                    />
                    <text x={pos.x} y={pos.y - 3.8} textAnchor="middle" fill="white" fontSize="1.4" fontFamily="system-ui" fontWeight="600">
                      {v.name}
                    </text>
                    <text x={pos.x} y={pos.y - 2.2} textAnchor="middle" fill={color} fontSize="1" fontFamily="system-ui">
                      {v.status}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-400">EV Active</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-amber-400">ICE Active</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-orange-400">Maintenance</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          <span className="text-gray-400">Offline</span>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-emerald-500/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-xs text-emerald-400 font-medium">LIVE</span>
      </div>
    </div>
  );
}
