"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shipments, vehicles, type Shipment } from "@/data/demo";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  MapPin,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  "in-transit": { label: "In Transit", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/25", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25", icon: CheckCircle },
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25", icon: Clock },
  delayed: { label: "Delayed", color: "text-red-400", bg: "bg-red-500/15 border-red-500/25", icon: AlertTriangle },
};

export default function ShipmentTracker() {
  const [filter, setFilter] = useState<"all" | Shipment["status"]>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = shipments.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: shipments.length,
    "in-transit": shipments.filter((s) => s.status === "in-transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    pending: shipments.filter((s) => s.status === "pending").length,
    delayed: shipments.filter((s) => s.status === "delayed").length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            Shipment Tracking
          </h2>
          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
            {shipments.length} shipments
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, origin, or destination…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {(["all", "in-transit", "pending", "delayed", "delivered"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                filter === s
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground bg-white/[0.03] border border-transparent hover:border-white/10"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              <span className="ml-1 opacity-60">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shipment cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filtered.map((shipment, i) => {
            const status = statusConfig[shipment.status];
            const vehicle = vehicles.find((v) => v.id === shipment.vehicleId);
            const isExpanded = expandedId === shipment.id;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={shipment.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setExpandedId(isExpanded ? null : shipment.id)}
                className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all overflow-hidden"
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{shipment.id.toUpperCase()}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {shipment.origin} → {shipment.destination}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.color} font-medium flex items-center gap-1`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {status.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {vehicle ? `${vehicle.name}` : "Unassigned"}
                      </span>
                      <span className="text-foreground font-medium">{shipment.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          shipment.status === "delayed"
                            ? "bg-red-500"
                            : shipment.status === "delivered"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${shipment.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {shipment.weight.toLocaleString()} kg
                    </span>
                    <span>{shipment.items} items</span>
                    <span className="ml-auto font-medium text-foreground">
                      ETA: {shipment.eta}
                    </span>
                  </div>
                </div>

                {/* Expanded timeline */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-2 border-t border-white/5">
                        <p className="text-xs font-medium text-muted-foreground mb-3">Shipment Timeline</p>
                        <div className="space-y-0">
                          {shipment.timeline.map((event, j) => (
                            <div key={j} className="flex items-start gap-3 relative">
                              {/* Vertical line */}
                              {j < shipment.timeline.length - 1 && (
                                <div
                                  className={`absolute left-[7px] top-[14px] w-[2px] h-[calc(100%-8px)] ${
                                    event.status === "done" ? "bg-emerald-500/40" : "bg-white/10"
                                  }`}
                                />
                              )}

                              {/* Dot */}
                              <div className={`relative z-10 w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                event.status === "done"
                                  ? "bg-emerald-500/20 border-emerald-500"
                                  : event.status === "current"
                                    ? "bg-blue-500/20 border-blue-500 animate-pulse"
                                    : "bg-white/5 border-white/20"
                              }`}>
                                {event.status === "done" && <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />}
                                {event.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                              </div>

                              {/* Content */}
                              <div className="pb-3">
                                <p className={`text-xs font-medium ${
                                  event.status === "pending" ? "text-muted-foreground" : "text-foreground"
                                }`}>
                                  {event.event}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{event.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
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
