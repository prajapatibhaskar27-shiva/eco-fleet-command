"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pastShipments, type PastShipment } from "@/data/demo";
import {
  Search,
  Star,
  MapPin,
  Leaf,
  DollarSign,
  Clock,
  Package,
  CheckCircle,
  Download,
} from "lucide-react";

export default function ShipmentHistory() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost" | "co2">("date");

  const filtered = useMemo(() => {
    let result = [...pastShipments];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.bookingId.toLowerCase().includes(q) ||
          s.serviceName.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sortBy === "cost") return b.cost - a.cost;
      if (sortBy === "co2") return b.co2Saved - a.co2Saved;
      return b.deliveredDate.localeCompare(a.deliveredDate);
    });
    return result;
  }, [search, sortBy]);

  const totalSpent = pastShipments.reduce((acc, s) => acc + s.cost, 0);
  const totalCo2 = pastShipments.reduce((acc, s) => acc + s.co2Saved, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Shipment History
          </h2>
          <span className="text-[11px] text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
            {pastShipments.length} shipments
          </span>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="text-lg font-bold text-foreground">${totalSpent.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground">Total spent</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="text-lg font-bold text-emerald-400">{totalCo2.toFixed(1)} kg</p>
            <p className="text-[10px] text-muted-foreground">CO₂ saved</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="text-lg font-bold text-foreground">{pastShipments.length}</p>
            <p className="text-[10px] text-muted-foreground">Delivered</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 font-mono"
          />
        </div>

        {/* Sort */}
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
          {(["date", "cost", "co2"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 text-[11px] rounded-md transition-all flex-1 ${
                sortBy === s
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {s === "date" ? "By Date" : s === "cost" ? "By Cost" : "By CO₂"}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{s.bookingId}</p>
                    <h3 className="text-sm font-semibold text-foreground">{s.serviceName}</h3>
                  </div>
                </div>
                <div className="text-right">
                  {s.rating && (
                    <div className="flex items-center gap-0.5 justify-end mb-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3 h-3 ${j < s.rating! ? "text-amber-400 fill-amber-400" : "text-white/10"}`}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{s.deliveredDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{s.origin}</span>
                <span className="text-emerald-500">→</span>
                <span>{s.destination}</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Package className="w-3 h-3" />
                  {s.weight} kg
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-foreground font-medium">${s.cost.toFixed(2)}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400 ml-auto">
                  <Leaf className="w-3 h-3" />
                  {s.co2Saved} kg saved
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
