"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications, type Notification } from "@/data/demo";import { Bell, Package, Truck, Tag, Settings, X, Check, CheckCheck, type LucideIcon } from "lucide-react";
const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  delivery: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
  booking: { icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
  promo: { icon: Tag, color: "text-amber-600", bg: "bg-amber-50" },
  system: { icon: Settings, color: "text-violet-600", bg: "bg-violet-50" },
};

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = items.filter((n) => !n.read).length;
  const visible = filter === "unread" ? items.filter((n) => !n.read) : items;

  const markAllRead = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setItems((p) => p.filter((n) => n.id !== id));
  const markRead = (id: string) => setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-500" />Notifications
          </h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" />Mark all read
              </button>
            )}
            <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{unreadCount} unread</span>
          </div>
        </div>
        <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-1 px-3 py-1 text-[11px] rounded-md transition-all font-medium ${filter === f ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-gray-500 hover:text-gray-700 border border-transparent"}`}>
              {f === "all" ? "All Notifications" : "Unread Only"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {visible.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.system;
            const Icon = cfg.icon;
            return (
              <motion.div key={n.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8, height: 0 }} transition={{ delay: i * 0.03 }}
                className={`rounded-xl border p-3.5 transition-all ${n.read ? "border-gray-100 bg-white" : "border-emerald-200 bg-emerald-50/40"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-[13px] font-semibold ${n.read ? "text-gray-600" : "text-gray-900"}`}>{n.title}</h3>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && <button onClick={() => markRead(n.id)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="Mark read"><Check className="w-3.5 h-3.5" /></button>}
                    <button onClick={() => dismiss(n.id)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="Dismiss"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="text-center py-12">
            <CheckCheck className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
            <p className="text-[13px] text-gray-400">{filter === "unread" ? "All caught up! No unread notifications." : "No notifications yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
