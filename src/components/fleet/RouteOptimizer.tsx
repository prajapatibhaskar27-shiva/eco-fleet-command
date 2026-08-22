"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { catalog, type CatalogItem, type ServiceCategory } from "@/data/demo";
import {
  Search,
  Star,
  Clock,
  Leaf,
  Zap,
  Truck,
  DollarSign,
  Shield,
  Package,
  ChevronRight,
  Filter,
  TrendingUp,
} from "lucide-react";

interface CatalogProps {
  onBookService: (item: CatalogItem) => void;
}

const categoryIcons: Record<ServiceCategory, any> = {
  express: Zap,
  standard: Truck,
  economy: Package,
  freight: Shield,
  specialized: Leaf,
};

const categoryColors: Record<ServiceCategory, string> = {
  express: "text-amber-400 bg-amber-500/15",
  standard: "text-blue-400 bg-blue-500/15",
  economy: "text-emerald-400 bg-emerald-500/15",
  freight: "text-violet-400 bg-violet-500/15",
  specialized: "text-cyan-400 bg-cyan-500/15",
};

export default function Catalog({ onBookService }: CatalogProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "price" | "rating" | "speed">("popular");

  const filtered = useMemo(() => {
    let result = [...catalog];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") result = result.filter((item) => item.category === categoryFilter);

    result.sort((a, b) => {
      if (sortBy === "price") return a.pricePerKg - b.pricePerKg;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "speed") return a.estimatedHours - b.estimatedHours;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
    return result;
  }, [search, categoryFilter, sortBy]);

  const formatHours = (h: number) => {
    if (h < 24) return `${h}h`;
    return `${Math.round(h / 24)}d`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Service Catalog</h2>
          <span className="text-[11px] text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
            {filtered.length} services
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {(["all", "express", "standard", "economy", "freight", "specialized"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                  categoryFilter === c
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {(["popular", "price", "rating", "speed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-all ${
                  sortBy === s
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filtered.map((item, i) => {
            const isActive = selectedId === item.id;
            const CatIcon = categoryIcons[item.category];
            const catColor = categoryColors[item.category];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedId(isActive ? null : item.id)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  isActive
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catColor}`}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        {item.popular && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-medium text-foreground">{item.rating}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">({item.reviews.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">${item.basePrice.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">+ ${item.pricePerKg}/kg</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.description}</p>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatHours(item.estimatedHours)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Leaf className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">{item.co2Estimate} kg CO₂/kg</span>
                  </span>
                  <span className="text-muted-foreground capitalize ml-auto">{item.category}</span>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[11px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">Features</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.features.map((f) => (
                            <span key={f} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-foreground border border-white/5">
                              {f}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookService(item);
                          }}
                          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                        >
                          Book {item.name}
                          <ChevronRight className="w-4 h-4" />
                        </button>
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
