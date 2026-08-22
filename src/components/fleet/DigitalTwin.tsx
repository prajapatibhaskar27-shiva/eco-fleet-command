"use client";

import { motion } from "framer-motion";
import { bookings, type Booking } from "@/data/demo";
import {
  Package,
  MapPin,
  Clock,
  Hash,
  DollarSign,
  Leaf,
  Calendar,
  CheckCircle,
  Circle,
  ArrowLeft,
  ExternalLink,
  Copy,
  Truck,
} from "lucide-react";

interface BookingDetailProps {
  bookingId: string;
  onBack: () => void;
}

const statusConfig = {
  pending: { label: "Pending", color: "text-slate-400", bg: "bg-slate-500/15 border-slate-500/30" },
  confirmed: { label: "Confirmed", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  "in-transit": { label: "In Transit", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30" },
  delivered: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" },
  cancelled: { label: "Cancelled", color: "text-gray-500", bg: "bg-gray-500/15 border-gray-500/30" },
};

export default function BookingDetail({ bookingId, onBack }: BookingDetailProps) {
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Booking not found</p>
          <button onClick={onBack} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300">Go back</button>
        </div>
      </div>
    );
  }

  const status = statusConfig[booking.status];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to bookings
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-muted-foreground">{booking.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.color} font-medium`}>
                  {status.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{booking.serviceName}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">${booking.cost.toFixed(2)}</p>
              <p className="text-[11px] text-muted-foreground">Total cost</p>
            </div>
          </div>
        </motion.div>

        {/* Route card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-4">
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">From</p>
              <p className="text-sm font-semibold text-foreground">{booking.origin}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-emerald-400" />
              <div className="w-16 h-[1px] bg-emerald-500/30" />
              <p className="text-[10px] text-muted-foreground">{booking.weight} kg · {booking.items} items</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">To</p>
              <p className="text-sm font-semibold text-foreground">{booking.destination}</p>
            </div>
          </div>
        </motion.div>

        {/* Details grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Hash, label: "Tracking", value: booking.trackingNumber, mono: true },
            { icon: Calendar, label: "Scheduled", value: booking.scheduledDate },
            { icon: Clock, label: "Est. Delivery", value: booking.estimatedDelivery },
            { icon: Package, label: "Items", value: `${booking.items} items` },
            { icon: DollarSign, label: "Cost", value: `$${booking.cost.toFixed(2)}` },
            { icon: Leaf, label: "CO₂ Saved", value: `${booking.co2Saved} kg`, green: true },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <item.icon className={`w-4 h-4 mb-2 ${item.green ? "text-emerald-400" : "text-muted-foreground"}`} />
              <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
              <p className={`text-sm font-medium text-foreground ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Copy tracking number */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button
            onClick={() => navigator.clipboard?.writeText(booking.trackingNumber)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-lg px-3 py-2 transition-all w-full"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="font-mono">{booking.trackingNumber}</span>
            <span className="ml-auto text-[10px]">Click to copy</span>
          </button>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tracking Timeline</h3>
          <div className="space-y-0">
            {booking.timeline.map((event, j) => (
              <div key={j} className="flex items-start gap-3 relative">
                {/* Vertical line */}
                {j < booking.timeline.length - 1 && (
                  <div className={`absolute left-[7px] top-[14px] w-[2px] h-[calc(100%-8px)] ${
                    event.status === "done" ? "bg-emerald-500/40" : "bg-white/10"
                  }`} />
                )}

                {/* Dot */}
                <div className={`relative z-10 w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  event.status === "done"
                    ? "bg-emerald-500/20 border-emerald-500"
                    : event.status === "current"
                      ? "bg-blue-500/20 border-blue-500 animate-pulse"
                      : "bg-white/5 border-white/20"
                }`}>
                  {event.status === "done" && <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />}
                  {event.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </div>

                {/* Content */}
                <div className="pb-4">
                  <p className={`text-sm font-medium ${event.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                    {event.event}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Eco impact */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Environmental Impact</p>
              <p className="text-xs text-muted-foreground">
                This shipment saved <span className="text-emerald-400 font-semibold">{booking.co2Saved} kg</span> of CO₂ compared to standard shipping.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
