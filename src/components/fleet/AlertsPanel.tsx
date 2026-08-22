"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { alerts, vehicles, type FleetAlert } from "@/data/demo";
import {
  AlertTriangle,
  Clock,
  Route,
  Leaf,
  Wrench,
  X,
  Check,
  Filter,
  Bell,
  ChevronRight,
} from "lucide-react";

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  delay: { label: "Delay", color: "text-red-400", icon: Clock },
  route: { label: "Route", color: "text-amber-400", icon: Route },
  idle: { label: "Idle", color: "text-slate-400", icon: Clock },
  maintenance: { label: "Maintenance", color: "text-orange-400", icon: Wrench },
  eco: { label: "Eco", color: "text-emerald-400", icon: Leaf },
};

const severityConfig: Record<string, { label: string; bg: string; border: string }> = {
  high: { label: "High", bg: "bg-red-500/15", border: "border-red-500/25" },
  medium: { label: "Medium", bg: "bg-amber-500/15", border: "border-amber-500/25" },
  low: { label: "Low", bg: "bg-blue-500/15", border: "border-blue-500/25" },
};

export default function AlertsPanel() {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((a) => {
    if (dismissedIds.has(a.id)) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    return true;
  });

  const dismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const resolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds((prev) => new Set([...prev, id]));
  };

  const unreadCount = alerts.filter((a) => !dismissedIds.has(a.id)).length;
  const highCount = alerts.filter((a) => a.severity === "high" && !dismissedIds.has(a.id)).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            AI Alerts
          </h2>
          <div className="flex items-center gap-2">
            {highCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25 font-medium">
                {highCount} critical
              </span>
            )}
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
              {unreadCount} active
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {["all", "delay", "route", "idle", "maintenance", "eco"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-1 text-[10px] rounded-md transition-all ${
                  typeFilter === t
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {["all", "high", "medium", "low"].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-2 py-1 text-[10px] rounded-md transition-all ${
                  severityFilter === s
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {visibleAlerts.map((alert, i) => {
            const type = typeConfig[alert.type];
            const severity = severityConfig[alert.severity];
            const vehicle = vehicles.find((v) => v.id === alert.vehicleId);
            const isResolved = resolvedIds.has(alert.id);
            const TypeIcon = type.icon;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={(e) => !isResolved && resolve(alert.id, e)}
                className={`rounded-xl border p-3 transition-all cursor-pointer ${
                  isResolved
                    ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
                    : alert.severity === "high"
                      ? "border-red-500/20 bg-red-500/[0.03] hover:bg-red-500/[0.06]"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.severity === "high" ? "bg-red-500/15" : "bg-white/5"
                    }`}>
                      <TypeIcon className={`w-4 h-4 ${type.color}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground leading-tight">{alert.title}</h3>
                      {vehicle && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {vehicle.name} · {vehicle.driver}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${severity.bg} ${severity.border} font-medium`}>
                      {severity.label}
                    </span>
                    <button
                      onClick={(e) => dismiss(alert.id, e)}
                      className="w-5 h-5 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{alert.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                  {isResolved ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Resolved
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      Click to resolve <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibleAlerts.length === 0 && (
          <div className="text-center py-12">
            <Check className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">All clear! No alerts matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
