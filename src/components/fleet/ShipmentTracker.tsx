"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pastShipments } from "@/data/demo";
import { Search, Star, MapPin, Leaf, DollarSign, Clock, Package, CheckCircle } from "lucide-react";

export default function ShipmentHistory() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost" | "co2">("date");

  const filtered = useMemo(() => {
    let r = [...pastShipments];
    if (search) { const q = search.toLowerCase(); r = r.filter((s) => s.bookingId.toLowerCase().includes(q) || s.serviceName.toLowerCase().includes(q) || s.origin.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q)); }
    r.sort((a, b) => { if (sortBy === "cost") return b.cost - a.cost; if (sortBy === "co2") return b.co2Saved - a.co2Saved; return b.deliveredDate.localeCompare(a.deliveredDate); });
    return r;
  }, [search, sortBy]);

  const totalSpent = pastShipments.reduce((a, s) => a + s.cost, 0);
  const totalCo2 = pastShipments.reduce((a, s) => a + s.co2Saved, 0);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" />Shipment History</h2>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{pastShipments.length} shipments</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100"><p className="text-[18px] font-bold text-gray-900">${totalSpent.toFixed(2)}</p><p className="text-[10px] text-gray-400">Total spent</p></div>
          <div className="text-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100"><p className="text-[18px] font-bold text-emerald-600">{totalCo2.toFixed(1)} kg</p><p className="text-[10px] text-gray-400">CO₂ saved</p></div>
          <div className="text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100"><p className="text-[18px] font-bold text-gray-900">{pastShipments.length}</p><p className="text-[10px] text-gray-400">Delivered</p></div>
        </div>
        <div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search history…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 font-mono transition-all" /></div>
        <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
          {(["date", "cost", "co2"] as const).map((s) => (<button key={s} onClick={() => setSortBy(s)} className={`flex-1 px-3 py-1 text-[11px] rounded-md transition-all font-medium ${sortBy === s ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500 hover:text-gray-700 border border-transparent"}`}>{s === "date" ? "By Date" : s === "cost" ? "By Cost" : "By CO₂"}</button>))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-gray-100 bg-white p-3.5 hover:bg-gray-50 hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-emerald-600" /></div><div><p className="text-[11px] font-mono text-gray-400">{s.bookingId}</p><h3 className="text-[13px] font-semibold text-gray-900">{s.serviceName}</h3></div></div>
                <div className="text-right">{s.rating && <div className="flex items-center gap-0.5 justify-end mb-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-3 h-3 ${j < s.rating! ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />)}</div>}<p className="text-[11px] text-gray-400">{s.deliveredDate}</p></div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-2"><MapPin className="w-3 h-3 shrink-0" /><span>{s.origin}</span><span className="text-emerald-400">→</span><span>{s.destination}</span></div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1 text-gray-400"><Package className="w-3 h-3" />{s.weight} kg</span>
                <span className="flex items-center gap-1 text-gray-400"><DollarSign className="w-3 h-3" /><span className="text-gray-700 font-medium">${s.cost.toFixed(2)}</span></span>
                <span className="flex items-center gap-1 text-emerald-500 ml-auto"><Leaf className="w-3 h-3" />{s.co2Saved} kg saved</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
