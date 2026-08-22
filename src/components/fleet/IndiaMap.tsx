"use client";

import { useState, useRef, useEffect } from "react";
import { indiaCities, type IndiaCity } from "@/data/demo";

interface IndiaMapProps {
  origin: string;
  destination: string;
  onSelectOrigin: (city: string) => void;
  onSelectDestination: (city: string) => void;
}

// Simplified India outline path (SVG coordinates matching city mapX/mapY space)
const INDIA_OUTLINE = `M 280 120 C 260 115, 230 120, 210 140 L 195 160 C 180 175, 170 195, 165 215
L 160 235 C 155 255, 148 275, 145 295 L 140 320 C 138 340, 140 355, 148 370
L 155 385 C 158 395, 155 405, 150 420 L 148 440 C 145 460, 150 480, 160 495
L 170 510 C 178 525, 185 540, 195 555 L 200 565 C 205 575, 215 585, 225 590
L 240 595 C 250 590, 258 580, 260 570 L 265 555 C 268 545, 275 535, 285 525
L 295 515 C 305 505, 310 495, 312 485 L 315 470 C 318 455, 325 440, 335 425
L 345 415 C 355 405, 365 398, 375 390 L 385 385 C 395 380, 405 375, 415 368
L 430 358 C 445 350, 460 340, 475 330 L 490 320 C 500 312, 510 305, 520 298
L 525 290 C 528 280, 525 268, 518 258 L 510 248 C 505 240, 498 235, 490 230
L 480 225 C 470 218, 458 212, 445 210 L 430 208 C 415 205, 400 202, 385 200
L 370 198 C 355 195, 340 190, 325 185 L 310 178 C 300 172, 292 165, 288 155
L 285 140 C 283 130, 282 125, 280 120 Z`;

function CityMarker({
  city,
  isSelected,
  isOrigin,
  isDest,
  onClick,
  type,
}: {
  city: IndiaCity;
  isSelected: boolean;
  isOrigin: boolean;
  isDest: boolean;
  onClick: () => void;
  type: "origin" | "destination" | "none";
}) {
  const [hovered, setHovered] = useState(false);
  const r = city.hub ? (isSelected ? 7 : 5) : (isSelected ? 5.5 : 3.5);
  const fillColor = isOrigin ? "#16B364" : isDest ? "#f59e0b" : isSelected ? "#16B364" : "#94a3b8";
  const strokeColor = isOrigin ? "#059669" : isDest ? "#d97706" : "#fff";

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow */}
      {(isSelected || isOrigin || isDest) && (
        <circle cx={city.mapX} cy={city.mapY} r={r + 6} fill={fillColor} opacity={0.15}>
          <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Outer ring */}
      <circle cx={city.mapX} cy={city.mapY} r={r + 2} fill="white" stroke={strokeColor} strokeWidth={1.5} opacity={isSelected || isOrigin || isDest ? 1 : 0.8} />
      {/* Inner dot */}
      <circle cx={city.mapX} cy={city.mapY} r={r} fill={fillColor} />
      {/* Hub inner dot */}
      {city.hub && <circle cx={city.mapX} cy={city.mapY} r={r * 0.4} fill="white" opacity={0.7} />}
      {/* Label */}
      {(city.hub || hovered || isSelected) && (
        <text
          x={city.mapX}
          y={city.mapY - r - 6}
          textAnchor="middle"
          fill={isSelected || isOrigin || isDest ? fillColor : "#475569"}
          fontSize={city.hub ? 10 : 9}
          fontWeight={city.hub || isSelected ? 700 : 500}
          fontFamily="system-ui, sans-serif"
        >
          {city.name}
        </text>
      )}
      {/* Tooltip on hover */}
      {hovered && !isSelected && (
        <g>
          <rect x={city.mapX - 45} y={city.mapY + r + 4} width={90} height={20} rx={4} fill="white" stroke="#e2e8f0" strokeWidth={0.5} filter="url(#tooltipShadow)" />
          <text x={city.mapX} y={city.mapY + r + 17} textAnchor="middle" fill="#475569" fontSize={8} fontFamily="system-ui">{city.state}</text>
        </g>
      )}
    </g>
  );
}

export default function IndiaMap({ origin, destination, onSelectOrigin, onSelectDestination }: IndiaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectMode, setSelectMode] = useState<"origin" | "destination">("origin");

  const originCity = indiaCities.find((c) => c.name === origin);
  const destCity = indiaCities.find((c) => c.name === destination);

  const handleCityClick = (city: IndiaCity) => {
    if (selectMode === "origin") {
      onSelectOrigin(city.name);
      if (destination !== city.name) setSelectMode("destination");
    } else {
      if (city.name !== origin) {
        onSelectDestination(city.name);
        setSelectMode("origin");
      }
    }
  };

  // Draw a curved route line between origin and destination
  const routePath = originCity && destCity
    ? `M ${originCity.mapX} ${originCity.mapY} Q ${(originCity.mapX + destCity.mapX) / 2} ${Math.min(originCity.mapY, destCity.mapY) - 40} ${destCity.mapX} ${destCity.mapY}`
    : null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
      {/* Selection mode toggle */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        <button
          onClick={() => setSelectMode("origin")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
            selectMode === "origin"
              ? "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200"
              : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" style={{ backgroundColor: selectMode === "origin" ? "white" : "#16B364" }} />
          Pickup
        </button>
        <button
          onClick={() => setSelectMode("destination")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
            selectMode === "destination"
              ? "bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200"
              : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" style={{ backgroundColor: selectMode === "destination" ? "white" : "#f59e0b" }} />
          Delivery
        </button>
      </div>

      {/* Selected cities */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 text-[11px]">
        {origin && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {origin}
          </div>
        )}
        {destination && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-700 font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {destination}
          </div>
        )}
      </div>

      {/* SVG Map */}
      <svg
        ref={svgRef}
        viewBox="120 100 430 520"
        className="w-full h-auto"
        style={{ minHeight: 320, maxHeight: 480 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="tooltipShadow"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" /></filter>
          <filter id="routeGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16B364" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Ocean background hint */}
        <rect x="120" y="100" width="430" height="520" fill="none" />

        {/* India outline */}
        <path
          d={INDIA_OUTLINE}
          fill="#f0fdf4"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Internal state hints - subtle grid */}
        <g opacity="0.06">
          {[200, 250, 300, 350, 400, 450, 500, 550].map((y) => (
            <line key={`h${y}`} x1="140" y1={y} x2="530" y2={y} stroke="#16B364" strokeWidth="0.3" />
          ))}
          {[180, 230, 280, 330, 380, 430, 480].map((x) => (
            <line key={`v${x}`} x1={x} y1="120" x2={x} y2="610" stroke="#16B364" strokeWidth="0.3" />
          ))}
        </g>

        {/* Route line */}
        {routePath && (
          <g>
            {/* Glow */}
            <path d={routePath} fill="none" stroke="url(#routeGrad)" strokeWidth="4" opacity="0.15" filter="url(#routeGlow)" />
            {/* Solid line */}
            <path d={routePath} fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeLinecap="round" />
            {/* Animated dash */}
            <path d={routePath} fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 4" opacity="0.6">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
            </path>
            {/* Moving dot */}
            {originCity && destCity && (
              <circle r="4" fill="#16B364" opacity="0.8">
                <animateMotion dur="3s" repeatCount="indefinite" path={routePath} />
              </circle>
            )}
          </g>
        )}

        {/* City markers */}
        {indiaCities.map((city) => (
          <CityMarker
            key={city.name}
            city={city}
            isOrigin={city.name === origin}
            isDest={city.name === destination}
            isSelected={false}
            type={city.name === origin ? "origin" : city.name === destination ? "destination" : "none"}
            onClick={() => handleCityClick(city)}
          />
        ))}

        {/* Distance estimate */}
        {originCity && destCity && (
          <g>
            {(() => {
              const R = 6371;
              const dLat = ((destCity.lat - originCity.lat) * Math.PI) / 180;
              const dLng = ((destCity.lng - originCity.lng) * Math.PI) / 180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((originCity.lat * Math.PI) / 180) * Math.cos((destCity.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
              const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
              const mx = (originCity.mapX + destCity.mapX) / 2;
              const my = Math.min(originCity.mapY, destCity.mapY) - 50;
              return (
                <g>
                  <rect x={mx - 40} y={my - 8} width={80} height={18} rx={9} fill="white" stroke="#e2e8f0" strokeWidth={0.5} filter="url(#tooltipShadow)" />
                  <text x={mx} y={my + 5} textAnchor="middle" fill="#16B364" fontSize={9} fontWeight={700} fontFamily="system-ui">
                    ~{dist.toLocaleString()} km
                  </text>
                </g>
              );
            })()}
          </g>
        )}
      </svg>
    </div>
  );
}
