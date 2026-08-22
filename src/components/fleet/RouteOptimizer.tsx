"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { catalog, type CatalogItem, type ServiceCategory } from "@/data/demo";
import { Search, Star, Clock, Leaf, Zap, Truck, Package, Shield, ChevronRight } from "lucide-react";

interface CatalogProps { onBookService: (item: CatalogItem) => void; }

const catColors: Record<ServiceCategory, string> = {
  express: "text-amber-600 bg-amber-50", standard: "text-blue-600 bg-blue-50",
  economy: "text-emerald-600 bg-emerald-50", freight: "text-violet-600 bg-violet-50",
  specialized: "text-cyan-600 bg-cyan-50",
};

export default function Catalog({ onBookService }: CatalogProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<ServiceCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "price" | "rating" | "speed">("popular");

  const filtered = useMemo(() => {
    let result = [...catalog];
    if (search) { const q = search.toLowerCase(); result = result.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)); }
    if (catFilter !== "all") result = result.filter((i) => i.category === catFilter);
    result.sort((a, b) => { if (sortBy === "price") return a.pricePerKg - b.pricePerKg; if (sortBy === "rating") return b.rating - a.rating; if (sortBy === "speed") return a.estimatedHours - b.estimatedHours; return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); });
    return result;
  }, [search, catFilter, sortBy]);

  const fmt = (h: number) => h < 24 ? `${h}h` : `${Math.round(h / 24)}d`;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-gray-900">Service Catalog</h2>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{filtered.length} services</span>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search services…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
            {(["all", "express", "standard", "economy", "freight", "specialized"] as const).map((c) => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-2.5 py-1 text-[11px] rounded-md transition-all font-medium ${catFilter === c ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500 hover:text-gray-700 border border-transparent"}`}>
                {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
            {(["popular", "price", "rating", "speed"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)} className={`px-2.5 py-1 text-[11px] rounded-md transition-all font-medium ${sortBy === s ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500 hover:text-gray-700 border border-transparent"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filtered.map((item, i) => {
            const isActive = selectedId === item.id;
            return (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04 }} onClick={() => setSelectedId(isActive ? null : item.id)} className={`rounded-xl border p-4 cursor-pointer transition-all ${isActive ? "border-emerald-300 bg-emerald-50/50 shadow-sm" : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catColors[item.category]}`}>
                      {item.category === "express" ? <Zap className="w-5 h-5" /> : item.category === "standard" ? <Truck className="w-5 h-5" /> : item.category === "economy" ? <Package className="w-5 h-5" /> : item.category === "freight" ? <Shield className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-semibold text-gray-900">{item.name}</h3>
                        {item.popular && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider">Popular</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-[12px] font-medium text-gray-700">{item.rating}</span></div>
                        <span className="text-[10px] text-gray-400">({item.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[18px] font-bold text-gray-900">${item.basePrice.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">+ ${item.pricePerKg}/kg</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{item.description}</p>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3 h-3" />{fmt(item.estimatedHours)}</span>
                  <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">{item.co2Estimate} kg CO₂/kg</span></span>
                  <span className="text-gray-400 capitalize ml-auto">{item.category}</span>
                </div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Features</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">{item.features.map((f) => (<span key={f} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100">{f}</span>))}</div>
                        <button onClick={(e) => { e.stopPropagation(); onBookService(item); }} className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-200">Book {item.name}<ChevronRight className="w-4 h-4" /></button>
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
