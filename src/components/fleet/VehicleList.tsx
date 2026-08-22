"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bookings, type Booking, type BookingStatus } from "@/data/demo";
import { Search, Package, MapPin, Leaf, Hash, DollarSign } from "lucide-react";

interface BookingListProps { onSelectBooking: (b: Booking) => void; selectedBookingId: string | null; }

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  confirmed: { label: "Confirmed", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  "in-transit": { label: "In Transit", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  delivered: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

export default function BookingList({ onSelectBooking, selectedBookingId }: BookingListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...bookings];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((b) => b.id.toLowerCase().includes(q) || b.serviceName.toLowerCase().includes(q) || b.origin.toLowerCase().includes(q) || b.destination.toLowerCase().includes(q) || b.trackingNumber.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    return result;
  }, [search, statusFilter]);

  const counts: Record<string, number> = { all: bookings.length };
  bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-gray-900">My Bookings</h2>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md font-mono border border-gray-100">{filtered.length} results</span>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by ID, service, or location…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 font-mono transition-all" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "in-transit", "confirmed", "pending", "delivered", "cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-2.5 py-1 text-[11px] rounded-lg transition-all font-medium ${statusFilter === s ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500 hover:text-gray-700 bg-gray-50 border border-gray-100 hover:border-gray-200"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              <span className="ml-1 opacity-50">{counts[s] || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filtered.map((b, i) => {
            const status = statusConfig[b.status];
            const isSelected = selectedBookingId === b.id;
            const isExpanded = expandedId === b.id;
            return (
              <motion.div key={b.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.03 }} onClick={() => { onSelectBooking(b); setExpandedId(isExpanded ? null : b.id); }} className={`rounded-xl border p-3.5 cursor-pointer transition-all ${isSelected ? "border-emerald-300 bg-emerald-50/50 shadow-sm" : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><Package className="w-4 h-4 text-emerald-600" /></div>
                    <div>
                      <p className="text-[11px] font-mono text-gray-400">{b.id}</p>
                      <h3 className="text-[13px] font-semibold text-gray-900 leading-tight">{b.serviceName}</h3>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${status.bg} ${status.color}`}>{status.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-2">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{b.origin}</span>
                  <span className="text-emerald-400">→</span>
                  <span className="truncate">{b.destination}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1 text-gray-400"><Hash className="w-3 h-3" /><span className="font-mono text-gray-600">{b.trackingNumber}</span></span>
                  <span className="flex items-center gap-1 text-gray-400"><DollarSign className="w-3 h-3" /><span className="text-gray-700 font-medium">${b.cost.toFixed(2)}</span></span>
                  <span className="flex items-center gap-1 text-emerald-500 ml-auto"><Leaf className="w-3 h-3" />{b.co2Saved} kg</span>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                          <div><span className="text-gray-400">Scheduled</span><p className="text-gray-700 font-medium">{b.scheduledDate}</p></div>
                          <div><span className="text-gray-400">Est. Delivery</span><p className="text-gray-700 font-medium">{b.estimatedDelivery}</p></div>
                          <div><span className="text-gray-400">Items</span><p className="text-gray-700 font-medium">{b.items}</p></div>
                          <div><span className="text-gray-400">Weight</span><p className="text-gray-700 font-medium">{b.weight} kg</p></div>
                        </div>
                        {b.timeline.length > 0 && (
                          <div className="space-y-1.5">
                            {b.timeline.slice(-2).map((event, j) => (
                              <div key={j} className="flex items-center gap-2 text-[11px]">
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${event.status === "done" ? "bg-emerald-500" : event.status === "current" ? "bg-blue-500 animate-pulse" : "bg-gray-200"}`} />
                                <span className="text-gray-500">{event.event}</span>
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
