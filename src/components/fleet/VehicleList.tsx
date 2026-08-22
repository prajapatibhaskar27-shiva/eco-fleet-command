"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookings, type Booking, type BookingStatus } from "@/data/demo";
import {
  Search,
  Package,
  MapPin,
  Clock,
  Leaf,
  ChevronDown,
  Hash,
  DollarSign,
} from "lucide-react";

interface BookingListProps {
  onSelectBooking: (b: Booking) => void;
  selectedBookingId: string | null;
}

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-slate-400", bg: "bg-slate-500/15 border-slate-500/30" },
  confirmed: { label: "Confirmed", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  "in-transit": { label: "In Transit", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30" },
  delivered: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" },
  cancelled: { label: "Cancelled", color: "text-gray-500", bg: "bg-gray-500/15 border-gray-500/30" },
};

export default function BookingList({ onSelectBooking, selectedBookingId }: BookingListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...bookings];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q) ||
          b.origin.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q) ||
          b.trackingNumber.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    return result;
  }, [search, statusFilter]);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    "in-transit": bookings.filter((b) => b.status === "in-transit").length,
    delivered: bookings.filter((b) => b.status === "delivered").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">My Bookings</h2>
          <span className="text-[11px] text-muted-foreground bg-white/5 px-2 py-1 rounded-md font-mono">
            {filtered.length} results
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, service, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 font-mono"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", "in-transit", "confirmed", "pending", "delivered", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                statusFilter === s
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              <span className="ml-1 opacity-50">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Booking cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        <AnimatePresence>
          {filtered.map((b, i) => {
            const status = statusConfig[b.status];
            const isSelected = selectedBookingId === b.id;
            const isExpanded = expandedId === b.id;

            return (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  onSelectBooking(b);
                  setExpandedId(isExpanded ? null : b.id);
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
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">{b.id}</p>
                      <h3 className="text-sm font-semibold text-foreground leading-tight">{b.serviceName}</h3>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.color} font-medium`}>
                    {status.label}
                  </span>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{b.origin}</span>
                  <span className="text-emerald-500">→</span>
                  <span className="truncate">{b.destination}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono text-foreground">{b.trackingNumber}</span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-foreground font-medium">${b.cost.toFixed(2)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground ml-auto">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">{b.co2Saved} kg</span>
                  </span>
                </div>

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
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Scheduled</span>
                            <p className="text-foreground font-medium">{b.scheduledDate}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Est. Delivery</span>
                            <p className="text-foreground font-medium">{b.estimatedDelivery}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Items</span>
                            <p className="text-foreground font-medium">{b.items}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight</span>
                            <p className="text-foreground font-medium">{b.weight} kg</p>
                          </div>
                        </div>

                        {/* Timeline preview */}
                        {b.timeline.length > 0 && (
                          <div className="space-y-1.5">
                            {b.timeline.slice(-2).map((event, j) => (
                              <div key={j} className="flex items-center gap-2 text-[11px]">
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  event.status === "done" ? "bg-emerald-500" : event.status === "current" ? "bg-blue-500 animate-pulse" : "bg-white/20"
                                }`} />
                                <span className="text-muted-foreground">{event.event}</span>
                              </div>
                            ))}
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
