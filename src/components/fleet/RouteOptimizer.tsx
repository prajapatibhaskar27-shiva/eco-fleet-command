"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { routes, vehicles, type Route } from "@/data/demo";
import {
  Leaf,
  Clock,
  Fuel,
  TrendingUp,
  ArrowRight,
  Sparkles,
  TreePine,
  Zap,
  BarChart3,
  Check,
  ChevronRight,
} from "lucide-react";

export default function RouteOptimizer() {
  const [greenMode, setGreenMode] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [appliedRoutes, setAppliedRoutes] = useState<Set<string>>(new Set());

  const handleApply = (routeId: string) => {
    setAppliedRoutes((prev) => {
      const next = new Set(prev);
      next.add(routeId);
      return next;
    });
  };

  const sortedRoutes = [...routes].sort((a, b) => (greenMode ? b.greenScore - a.greenScore : a.distance - b.distance));

  const totalFuelSaved = routes.reduce((acc, r) => acc + r.fuelSaved, 0);
  const totalCo2Saved = routes.reduce((acc, r) => acc + r.co2Saved, 0);
  const avgGreenScore = Math.round(routes.reduce((acc, r) => acc + r.greenScore, 0) / routes.length);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              AI Route Optimizer
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Powered by EcoPilot intelligence</p>
          </div>
        </div>

        {/* Green Route Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Green Route Mode</p>
              <p className="text-xs text-muted-foreground">
                Balances time, fuel, traffic & CO₂
              </p>
            </div>
          </div>
          <button
            onClick={() => setGreenMode(!greenMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              greenMode ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
              animate={{ left: greenMode ? 28 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <Fuel className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
          <p className="text-lg font-bold text-emerald-400">{totalFuelSaved.toFixed(0)}%</p>
          <p className="text-[10px] text-muted-foreground">Fuel Saved</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
          <Leaf className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
          <p className="text-lg font-bold text-cyan-400">{totalCo2Saved.toFixed(1)}</p>
          <p className="text-[10px] text-muted-foreground">kg CO₂ Saved</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <BarChart3 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
          <p className="text-lg font-bold text-emerald-400">{avgGreenScore}</p>
          <p className="text-[10px] text-muted-foreground">Avg Green Score</p>
        </div>
      </div>

      {/* Route list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {greenMode ? "Ranked by Green Score" : "Ranked by Distance"}
        </p>

        {sortedRoutes.map((route, i) => {
          const isActive = selectedRoute === route.id;
          const isApplied = appliedRoutes.has(route.id);
          const vehicle = vehicles.find((v) => route.vehicles.includes(v.id));

          return (
            <motion.div
              key={route.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRoute(isActive ? null : route.id)}
              className={`rounded-xl border p-3 cursor-pointer transition-all ${
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{route.name}</h3>
                  </div>
                  {vehicle && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {vehicle.name} · {vehicle.driver}
                    </p>
                  )}

                    <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{route.greenScore}</span>
                      <span className="text-muted-foreground">green</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground font-medium">{route.fuelSaved}%</span>
                      <span className="text-muted-foreground">saved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground font-medium">{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground font-medium">{route.distance} km</span>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  route.status === "optimal"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : route.status === "suboptimal"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {route.status}
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-white/5">
                      {/* Green Score Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Green Score</span>
                          <span className="text-emerald-400 font-semibold">{route.greenScore}/100</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              route.greenScore >= 80
                                ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                                : route.greenScore >= 60
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  : "bg-gradient-to-r from-red-500 to-orange-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${route.greenScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Waypoints */}
                      <div className="flex items-center gap-1 text-xs mb-3 overflow-x-auto pb-1">
                        {route.waypoints.map((wp, j) => (
                          <div key={j} className="flex items-center gap-1 shrink-0">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-foreground">{wp.label}</span>
                            {j < route.waypoints.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                          </div>
                        ))}
                      </div>

                      {/* Potential savings */}
                      <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs mb-3">
                        <p className="text-emerald-400 font-medium flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {greenMode ? "Green optimization" : "Speed optimization"} active
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          Saves {route.co2Saved} kg CO₂ and {route.fuelSaved}% fuel per trip
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(route.id);
                        }}
                        disabled={isApplied}
                        className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                          isApplied
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Route Applied
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" /> Apply Optimized Route
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
