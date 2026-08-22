"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vehicles, type Vehicle, type VehicleStatus } from "@/data/demo";
import {
  Battery,
  Fuel,
  Gauge,
  Leaf,
  Search,
  Truck,
  Zap,
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  Package,
} from "lucide-react";

interface VehicleListProps {
  onSelectVehicle: (v: Vehicle) => void;
  selectedVehicleId: string | null;
}

const statusConfig: Record<VehicleStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" },
  idle: { label: "Idle", color: "text-slate-400", bg: "bg-slate-500/15 border-slate-500/30" },
  maintenance: { label: "Maintenance", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30" },
  offline: { label: "Offline", color: "text-gray-500", bg: "bg-gray-500/15 border-gray-500/30" },
};

function FuelGauge({ value, isEV, battery }: { value: number; isEV: boolean; battery?: number }) {
  const pct = isEV ? (battery ?? 0) : value;
  const color = pct > 60 ? "bg-emerald-500" : pct > 30 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      {isEV ? <Battery className="w-3.5 h-3.5 text-emerald-400" /> : <Fuel className="w-3.5 h-3.5 text-slate-400" />}
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-9 text-right">{pct}%</span>
    </div>
  );
}

function LoadBar({ load, max }: { load: number; max: number }) {
  const pct = (load / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">Load</span>
        <span className="text-foreground font-medium">
          {load.toLocaleString()} / {max.toLocaleString()} kg
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function VehicleList({ onSelectVehicle, selectedVehicleId }: VehicleListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "ev" | "ice">("all");
  const [sortBy, setSortBy] = useState<"name" | "fuel" | "utilization" | "load">("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...vehicles];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.driver.toLowerCase().includes(q) ||
          v.route.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((v) => v.status === statusFilter);
    if (typeFilter === "ev") result = result.filter((v) => v.type.startsWith("ev"));
    if (typeFilter === "ice") result = result.filter((v) => !v.type.startsWith("ev"));

    result.sort((a, b) => {
      if (sortBy === "fuel") return (b.type.startsWith("ev") ? b.battery ?? 0 : b.fuel) - (a.type.startsWith("ev") ? a.battery ?? 0 : a.fuel);
      if (sortBy === "utilization") return b.utilization - a.utilization;
      if (sortBy === "load") return b.load - a.load;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [search, statusFilter, typeFilter, sortBy]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Fleet Vehicles</h2>
          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
            {filtered.length} of {vehicles.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles, drivers, routes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {(["all", "active", "idle", "maintenance", "offline"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  statusFilter === s
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {(["all", "ev", "ice"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1 ${
                  typeFilter === t
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {t === "ev" && <Zap className="w-3 h-3" />}
                {t === "all" ? "All Types" : t === "ev" ? "Electric" : "ICE"}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setSortBy(sortBy === "name" ? "utilization" : sortBy === "utilization" ? "load" : sortBy === "load" ? "fuel" : "name")
            }
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground bg-white/5 border border-white/10 rounded-lg"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortBy === "name" ? "Name" : sortBy === "fuel" ? "Fuel" : sortBy === "utilization" ? "Util." : "Load"}
          </button>
        </div>
      </div>

      {/* Vehicle cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        <AnimatePresence>
          {filtered.map((v, i) => {
            const isEV = v.type.startsWith("ev");
            const isSelected = selectedVehicleId === v.id;
            const isExpanded = expandedId === v.id;
            const status = statusConfig[v.status];

            return (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  onSelectVehicle(v);
                  setExpandedId(isExpanded ? null : v.id);
                }}
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isEV ? "bg-emerald-500/15" : "bg-amber-500/15"
                      }`}
                    >
                      {isEV ? (
                        <Zap className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Truck className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-tight">{v.name}</h3>
                      <p className="text-xs text-muted-foreground">{v.driver}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.color} font-medium`}>
                    {status.label}
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                  <div className="bg-white/[0.03] rounded-lg py-1.5 px-1">
                    <Gauge className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">{v.speed > 0 ? `${v.speed} km/h` : "—"}</p>
                    <p className="text-[10px] text-muted-foreground">Speed</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg py-1.5 px-1">
                    <Leaf className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">{v.emissions > 0 ? `${v.emissions}g` : "0g"}</p>
                    <p className="text-[10px] text-muted-foreground">CO₂/km</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg py-1.5 px-1">
                    <Package className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">{v.utilization}%</p>
                    <p className="text-[10px] text-muted-foreground">Util.</p>
                  </div>
                </div>

                {/* Fuel / Battery */}
                <FuelGauge value={v.fuel} isEV={isEV} battery={v.battery} />

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                        <LoadBar load={v.load} max={v.maxLoad} />

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Route</span>
                            <p className="text-foreground font-medium">{v.route}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Destination</span>
                            <p className="text-foreground font-medium">{v.destination}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ETA</span>
                            <p className="text-foreground font-medium">{v.eta}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Distance</span>
                            <p className="text-foreground font-medium">{v.totalKm.toLocaleString()} km</p>
                          </div>
                        </div>

                        {v.lastMaintenance && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <AlertTriangle className="w-3 h-3" />
                            Last service: {v.lastMaintenance}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
