"use client";

import { motion } from "framer-motion";
import { bookings } from "@/data/demo";
import { Package, MapPin, Clock, Hash, DollarSign, Leaf, Calendar, CheckCircle, ArrowLeft, Copy, Truck } from "lucide-react";

interface Props { bookingId: string; onBack: () => void; }

const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  confirmed: { label: "Confirmed", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  "in-transit": { label: "In Transit", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  delivered: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

export default function BookingDetail({ bookingId, onBack }: Props) {
  const b = bookings.find((bk) => bk.id === bookingId);
  if (!b) return <div className="h-full flex items-center justify-center"><div className="text-center"><Package className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">Booking not found</p><button onClick={onBack} className="mt-3 text-sm text-emerald-600 hover:text-emerald-700">Go back</button></div></div>;
  const s = statusCfg[b.status];

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={onBack} className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors"><ArrowLeft className="w-4 h-4" />Back to bookings</motion.button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1"><span className="text-[13px] font-mono text-gray-400">{b.id}</span><span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${s.bg} ${s.color}`}>{s.label}</span></div>
              <h1 className="text-[22px] font-bold text-gray-900">{b.serviceName}</h1>
            </div>
            <div className="text-right"><p className="text-[22px] font-bold text-gray-900">${b.cost.toFixed(2)}</p><p className="text-[11px] text-gray-400">Total cost</p></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-center flex-1"><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">From</p><p className="text-[14px] font-semibold text-gray-900">{b.origin}</p></div>
            <div className="flex flex-col items-center gap-1"><Truck className="w-5 h-5 text-emerald-500" /><div className="w-16 h-[1px] bg-emerald-200" /><p className="text-[10px] text-gray-400">{b.weight} kg · {b.items} items</p></div>
            <div className="text-center flex-1"><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">To</p><p className="text-[14px] font-semibold text-gray-900">{b.destination}</p></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[{ icon: Hash, label: "Tracking", value: b.trackingNumber, mono: true }, { icon: Calendar, label: "Scheduled", value: b.scheduledDate }, { icon: Clock, label: "Est. Delivery", value: b.estimatedDelivery }, { icon: Package, label: "Items", value: `${b.items} items` }, { icon: DollarSign, label: "Cost", value: `$${b.cost.toFixed(2)}` }, { icon: Leaf, label: "CO₂ Saved", value: `${b.co2Saved} kg`, green: true }].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <item.icon className={`w-4 h-4 mb-2 ${item.green ? "text-emerald-500" : "text-gray-400"}`} />
              <p className="text-[10px] text-gray-400 mb-0.5">{item.label}</p>
              <p className={`text-[13px] font-medium text-gray-900 ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button onClick={() => navigator.clipboard?.writeText(b.trackingNumber)} className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-gray-900 bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl px-3 py-2 transition-all w-full">
            <Copy className="w-3.5 h-3.5" /><span className="font-mono">{b.trackingNumber}</span><span className="ml-auto text-[10px]">Click to copy</span>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
          <div className="space-y-0">
            {b.timeline.map((ev, j) => (
              <div key={j} className="flex items-start gap-3 relative">
                {j < b.timeline.length - 1 && <div className={`absolute left-[7px] top-[14px] w-[2px] h-[calc(100%-8px)] ${ev.status === "done" ? "bg-emerald-300" : "bg-gray-200"}`} />}
                <div className={`relative z-10 w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${ev.status === "done" ? "bg-emerald-50 border-emerald-400" : ev.status === "current" ? "bg-blue-50 border-blue-400 animate-pulse" : "bg-gray-50 border-gray-200"}`}>
                  {ev.status === "done" && <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />}
                  {ev.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
                <div className="pb-4"><p className={`text-[13px] font-medium ${ev.status === "pending" ? "text-gray-400" : "text-gray-900"}`}>{ev.event}</p><p className="text-[11px] text-gray-400">{ev.time}</p></div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Leaf className="w-5 h-5 text-emerald-600" /></div>
            <div><p className="text-[14px] font-semibold text-gray-900">Environmental Impact</p><p className="text-[12px] text-gray-500">This shipment saved <span className="text-emerald-600 font-semibold">{b.co2Saved} kg</span> of CO₂ compared to standard shipping.</p></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
