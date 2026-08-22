"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications, type Notification } from "@/data/demo";
import {
  Bell,
  Package,
  Truck,
  Tag,
  Settings,
  X,
  Check,
  CheckCheck,
} from "lucide-react";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  delivery: { icon: Truck, color: "text-blue-400", bg: "bg-blue-500/15" },
  booking: { icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  promo: { icon: Tag, color: "text-amber-400", bg: "bg-amber-500/15" },
  system: { icon: Settings, color: "text-violet-400", bg: "bg-violet-500/15" },
};

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = items.filter((n) => !n.read).length;
  const visible = filter === "unread" ? items.filter((n) => !n.read) : items;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            Notifications
          </h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <span className="text-[11px] text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
              {unreadCount} unread
            </span>
          </div>
        </div>

        {/* Filter */}
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-3 py-1 text-[11px] rounded-md transition-all ${
                filter === f
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {f === "all" ? "All Notifications" : "Unread Only"}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {visible.map((n, i) => {
            const config = typeConfig[n.type] || typeConfig.system;
            const Icon = config.icon;

            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-xl border p-3 transition-all ${
                  n.read
                    ? "border-white/5 bg-white/[0.02]"
                    : "border-emerald-500/20 bg-emerald-500/[0.03]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-semibold ${n.read ? "text-foreground/70" : "text-foreground"}`}>
                        {n.title}
                      </h3>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(n.id)}
                      className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="text-center py-12">
            <CheckCheck className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {filter === "unread" ? "All caught up! No unread notifications." : "No notifications yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
