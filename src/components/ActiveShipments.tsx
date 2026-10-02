"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Navigation, Fuel, Clock, AlertTriangle, Search,
  X, Anchor, Thermometer, MapPin, Eye,
  Package, TrendingUp, Globe2, Activity, type LucideIcon,
} from "lucide-react";
import {
  energyShipments as baseShipments,
  type EnergyShipment,
  type DisruptionZone,
} from "@/data/demo";

/* ── Disruption transformer ─────────────────────────────────────────────── */
function applyDisruption(
  shipments: EnergyShipment[],
  disruption: DisruptionZone,
): EnergyShipment[] {
  return shipments.map((s) => {
    if (disruption === "NONE") {
      return { ...s, disruption: "NONE", status: s.id === "ES-007" ? ("docked" as const) : ("in-transit" as const), etaDays: s.etaOriginalDays };
    }

    if (disruption === "HORMUZ") {
      // Vessels transiting Persian Gulf (origin: Ras Tanura, Basra, Ras Laffan, Fujairah)
      const affected =
        s.origin.includes("Ras Tanura") ||
        s.origin.includes("Basra") ||
        s.origin.includes("Ras Laffan") ||
        s.origin.includes("Fujairah") ||
        s.id === "ES-004";
      if (affected && s.etaOriginalDays > 0) {
        const rerouteDays = 12 + Math.round(Math.random() * 3);
        return {
          ...s,
          disruption: "HORMUZ",
          status: "rerouted" as const,
          etaDays: s.etaOriginalDays + rerouteDays,
        };
      }
    }

    if (disruption === "RED_SEA") {
      // Vessels going through Suez / Mediterranean
      const affected =
        s.origin.includes("Mediterranean") ||
        s.waypoints.some((w) => w.name.includes("Suez") || w.name.includes("Red Sea"));
      if (affected && s.etaOriginalDays > 0) {
        const rerouteDays = 6 + Math.round(Math.random() * 1.5 * 10) / 10;
        return {
          ...s,
          disruption: "RED_SEA",
          status: "rerouted" as const,
          etaDays: s.etaOriginalDays + rerouteDays,
        };
      }
    }

    return s;
  });
}

/* ── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status, disruption }: { status: string; disruption: DisruptionZone }) {
  if (disruption === "HORMUZ") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <AlertTriangle className="w-3 h-3" />
        Rerouting via Cape Route (+14d)
      </span>
    );
  }
  if (disruption === "RED_SEA") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-3 h-3" />
        Cape Reroute Active (+6.5d)
      </span>
    );
  }
  if (status === "docked") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
        <Anchor className="w-3 h-3" />
        Docked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
      On Schedule
    </span>
  );
}

/* ── Progress bar ───────────────────────────────────────────────────────── */
function TransitProgress({ progress, status }: { progress: number; status: string }) {
  const color = status === "rerouted" ? "bg-rose-500" : status === "docked" ? "bg-blue-500" : "bg-emerald-500";
  const glow = status === "rerouted" ? "shadow-rose-500/30" : status === "docked" ? "shadow-blue-500/30" : "shadow-emerald-500/30";
  return (
    <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color} shadow-lg ${glow}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

/* ── Telemetry Detail Modal ─────────────────────────────────────────────── */
function TelemetryModal({ shipment, onClose }: { shipment: EnergyShipment; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"route" | "telemetry" | "cargo">("route");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/60 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-white">{shipment.vesselName}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{shipment.vesselClass} · {shipment.imo} · {shipment.flag}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-3 bg-slate-800 rounded-lg p-0.5">
            {(["route", "telemetry", "cargo"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                  activeTab === tab ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeTab === "route" && (
            <div className="space-y-0">
              {shipment.waypoints.map((wp, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      wp.passed ? "bg-emerald-500 border-emerald-400" : i === shipment.waypoints.findIndex((w) => !w.passed) ? "bg-amber-500 border-amber-400 animate-pulse" : "bg-slate-700 border-slate-600"
                    }`} />
                    {i < shipment.waypoints.length - 1 && (
                      <div className={`w-0.5 h-8 ${wp.passed ? "bg-emerald-500/40" : "bg-slate-700/40"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-[12px] font-semibold ${wp.passed ? "text-emerald-400" : "text-slate-300"}`}>{wp.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {wp.lat.toFixed(2)}°{wp.lat >= 0 ? "N" : "S"}, {wp.lng.toFixed(2)}°{wp.lng >= 0 ? "E" : "W"}
                    </p>
                    <p className="text-[10px] text-slate-500">ETA: {wp.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="grid grid-cols-2 gap-3">
              <TelemetryStat icon={Navigation} label="Speed" value={`${shipment.speed} kn`} color="text-emerald-400" />
              <TelemetryStat icon={Globe2} label="Course" value={`${shipment.course}°`} color="text-blue-400" />
              <TelemetryStat icon={Thermometer} label="Sea Temp" value={`${shipment.seaTemp}°C`} color="text-amber-400" />
              <TelemetryStat icon={Activity} label="Status" value={shipment.status} color="text-slate-300" />
              <TelemetryStat icon={MapPin} label="Latitude" value={`${Math.abs(shipment.lat).toFixed(1)}°${shipment.lat >= 0 ? "N" : "S"}`} color="text-slate-300" />
              <TelemetryStat icon={MapPin} label="Longitude" value={`${Math.abs(shipment.lng).toFixed(1)}°${shipment.lng >= 0 ? "E" : "W"}`} color="text-slate-300" />
              <TelemetryStat icon={TrendingUp} label="Draft" value={`${shipment.draft}m`} color="text-blue-400" />
              <TelemetryStat icon={Ship} label="Class" value={shipment.vesselClass} color="text-emerald-400" />
            </div>
          )}

          {activeTab === "cargo" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span className="text-[13px] font-semibold text-white">Cargo Manifest</span>
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-slate-400">Crude Type</span><span className="text-white font-medium">{shipment.crudeType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Payload</span><span className="text-white font-medium">{shipment.payloadBarrels.toLocaleString()} bbl</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Cargo Temp</span><span className="text-amber-400 font-medium">{shipment.cargoTemp}°C</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Freight Cost</span><span className="text-emerald-400 font-medium">${shipment.freightCost.toFixed(2)}/bbl</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total Value</span><span className="text-white font-semibold">${(shipment.freightCost * shipment.payloadBarrels).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="w-4 h-4 text-emerald-400" />
                  <span className="text-[13px] font-semibold text-white">Audit Log</span>
                </div>
                <div className="space-y-2">
                  {[
                    { time: "14:32 UTC", event: "Voyage telemetry transmitted — all parameters nominal" },
                    { time: "08:15 UTC", event: "Cargo temperature check: within threshold" },
                    { time: "02:00 UTC", event: "Position report filed with flag state" },
                    { time: "Yesterday", event: "Port agent notified of updated ETA" },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-slate-500 shrink-0 w-20">{log.time}</span>
                      <span className="text-slate-300">{log.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TelemetryStat({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-[14px] font-bold ${color}`}>{value}</p>
    </div>
  );
}

/* ── Main ActiveShipments Component ─────────────────────────────────────── */
interface ActiveShipmentsProps {
  disruption?: DisruptionZone;
}

export default function ActiveShipments({ disruption = "NONE" }: ActiveShipmentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "in-transit" | "rerouted" | "docked">("all");
  const [selectedShipment, setSelectedShipment] = useState<EnergyShipment | null>(null);
  const [, setTick] = useState(0);

  // Live telemetry tick
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const shipments = useMemo(() => applyDisruption(baseShipments, disruption), [disruption]);

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.crudeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchQuery, statusFilter]);

  const counts = useMemo(() => ({
    all: shipments.length,
    "in-transit": shipments.filter((s) => s.status === "in-transit").length,
    rerouted: shipments.filter((s) => s.status === "rerouted").length,
    docked: shipments.filter((s) => s.status === "docked").length,
  }), [shipments]);

  const disruptedCount = shipments.filter((s) => s.disruption !== "NONE").length;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Ship className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white">Active Shipments & Live Cargo Tracker</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Crude oil & energy logistics — {shipments.length} vessels tracked
              {disruptedCount > 0 && (
                <span className="ml-2 text-amber-400 font-semibold">· {disruptedCount} disrupted</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vessel name, crude type, or destination..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
          />
        </div>
        {/* Status Tabs */}
        <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1">
          {(["all", "in-transit", "rerouted", "docked"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab === "all" ? "All" : tab === "in-transit" ? "In Transit" : tab === "rerouted" ? "Rerouted" : "Docked"}
              <span className="ml-1 text-slate-500">({counts[tab]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Disruption Alert Banner */}
      {disruption !== "NONE" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border ${
            disruption === "HORMUZ"
              ? "bg-rose-500/10 border-rose-500/30"
              : "bg-amber-500/10 border-amber-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${disruption === "HORMUZ" ? "text-rose-400" : "text-amber-400"}`} />
            <span className={`text-[12px] font-semibold ${disruption === "HORMUZ" ? "text-rose-300" : "text-amber-300"}`}>
              {disruption === "HORMUZ"
                ? "Strait of Hormuz Blockade Active — Affected vessels rerouting via Cape of Good Hope (+12–14d delay)"
                : "Red Sea Threat Advisory — Suez-bound vessels rerouting via Cape (+6.5d delay)"}
            </span>
          </div>
        </motion.div>
      )}

      {/* Shipment Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((shipment, i) => (
            <motion.div
              key={shipment.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={`rounded-2xl border p-4 transition-all hover:shadow-lg cursor-pointer ${
                shipment.disruption !== "NONE"
                  ? "bg-slate-900/90 border-rose-500/20 hover:border-rose-500/40"
                  : shipment.status === "docked"
                  ? "bg-slate-900/90 border-blue-500/20 hover:border-blue-500/40"
                  : "bg-slate-900/90 border-slate-800 hover:border-emerald-500/30"
              }`}
              onClick={() => setSelectedShipment(shipment)}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    shipment.disruption !== "NONE"
                      ? "bg-rose-500/10"
                      : shipment.status === "docked"
                      ? "bg-blue-500/10"
                      : "bg-emerald-500/10"
                  }`}>
                    <Ship className={`w-4.5 h-4.5 ${
                      shipment.disruption !== "NONE"
                        ? "text-rose-400"
                        : shipment.status === "docked"
                        ? "text-blue-400"
                        : "text-emerald-400"
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-white leading-tight">{shipment.vesselName}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{shipment.vesselClass} · {shipment.imo}</p>
                  </div>
                </div>
                <StatusBadge status={shipment.status} disruption={shipment.disruption} />
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 mb-3 text-[12px]">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="text-slate-300 truncate">{shipment.origin}</span>
                <span className="text-slate-600 mx-0.5">➔</span>
                <span className="text-white font-medium truncate">{shipment.destination}</span>
              </div>

              {/* Cargo */}
              <div className="flex items-center gap-2 mb-3 px-2.5 py-2 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] text-slate-300">{shipment.payload}</span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Transit Progress</span>
                  <span className="text-[11px] font-semibold text-white">{shipment.progress}%</span>
                </div>
                <TransitProgress progress={shipment.progress} status={shipment.status} />
              </div>

              {/* Telemetry Row */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center p-1.5 rounded-lg bg-slate-800/40">
                  <Clock className="w-3 h-3 text-slate-500 mx-auto mb-0.5" />
                  <p className={`text-[11px] font-bold ${shipment.disruption !== "NONE" ? "text-rose-400" : "text-emerald-400"}`}>
                    {shipment.status === "docked" ? "Docked" : shipment.etaDays <= 0 ? "Arrived" : `${shipment.etaDays}d`}
                  </p>
                  <p className="text-[9px] text-slate-600">ETA</p>
                </div>
                <div className="text-center p-1.5 rounded-lg bg-slate-800/40">
                  <Navigation className="w-3 h-3 text-slate-500 mx-auto mb-0.5" />
                  <p className="text-[11px] font-bold text-white">{shipment.speed} kn</p>
                  <p className="text-[9px] text-slate-600">Speed</p>
                </div>
                <div className="text-center p-1.5 rounded-lg bg-slate-800/40">
                  <Thermometer className="w-3 h-3 text-slate-500 mx-auto mb-0.5" />
                  <p className="text-[11px] font-bold text-amber-400">{shipment.seaTemp}°C</p>
                  <p className="text-[9px] text-slate-600">Sea Temp</p>
                </div>
                <div className="text-center p-1.5 rounded-lg bg-slate-800/40">
                  <Fuel className="w-3 h-3 text-slate-500 mx-auto mb-0.5" />
                  <p className="text-[11px] font-bold text-emerald-400">${shipment.freightCost}/bbl</p>
                  <p className="text-[9px] text-slate-600">Freight</p>
                </div>
              </div>

              {/* ETA override text for disrupted vessels */}
              {shipment.disruption !== "NONE" && (
                <div className="mb-3 px-2.5 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span className="text-[11px] text-rose-300 font-medium">
                      ETA: {shipment.etaDays} Days ({shipment.disruption === "HORMUZ" ? "Cape Diversion" : "Cape Reroute"})
                      <span className="text-[10px] text-rose-400/60 ml-1">
                        (+{(shipment.etaDays - shipment.etaOriginalDays).toFixed(1)}d from original)
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Action */}
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedShipment(shipment); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-[11px] font-semibold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
              >
                <Eye className="w-3 h-3" />
                Inspect Telemetry & Audit Logs
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Ship className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-[13px] text-slate-500">No shipments match your search criteria</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedShipment && (
          <TelemetryModal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
