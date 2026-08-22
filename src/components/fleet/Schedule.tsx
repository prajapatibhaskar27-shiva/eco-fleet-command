"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { catalog, type CatalogItem } from "@/data/demo";
import { Calendar, Clock, ChevronRight, ArrowLeft, Check, DollarSign, Leaf } from "lucide-react";

interface ScheduleProps { preselectedServiceId?: string | null; onComplete: () => void; }

const cities = ["San Francisco, CA","Los Angeles, CA","Seattle, WA","Portland, OR","Denver, CO","Austin, TX","Chicago, IL","New York, NY","Boston, MA","Phoenix, AZ","Houston, TX","Dallas, TX","Miami, FL","Orlando, FL","Salt Lake City, UT","Sacramento, CA","San Jose, CA"];

export default function Schedule({ preselectedServiceId, onComplete }: ScheduleProps) {
  const [step, setStep] = useState<"service" | "details" | "confirm">(preselectedServiceId ? "details" : "service");
  const [svc, setSvc] = useState<CatalogItem | null>(preselectedServiceId ? catalog.find((s) => s.id === preselectedServiceId) ?? null : null);
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("5");
  const [items, setItems] = useState("1");
  const [notes, setNotes] = useState("");

  const cost = svc ? svc.basePrice + svc.pricePerKg * parseFloat(weight || "0") : 0;
  const co2 = svc ? svc.co2Estimate * parseFloat(weight || "0") : 0;

  const handleSvc = (s: CatalogItem) => { setSvc(s); setStep("details"); };
  const handleConfirm = () => { setStep("confirm"); setTimeout(onComplete, 2000); };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {step !== "service" && step !== "confirm" && (
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => setStep("service")} className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />Back
          </motion.button>
        )}

        {/* Steps */}
        <div className="flex items-center gap-2 mb-6">
          {["service", "details", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${step === s ? "bg-emerald-500 text-white" : ["service", "details", "confirm"].indexOf(step) > i ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                {["service", "details", "confirm"].indexOf(step) > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[12px] ${step === s ? "text-gray-900 font-semibold" : "text-gray-400"}`}>{s === "service" ? "Service" : s === "details" ? "Details" : "Confirm"}</span>
              {i < 2 && <div className="w-8 h-[1px] bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "service" && (
            <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Choose a service</h2>
              <p className="text-[13px] text-gray-500 mb-4">Select the shipping option that fits your needs.</p>
              <div className="space-y-2">
                {catalog.map((s) => (
                  <button key={s.id} onClick={() => handleSvc(s)} className="w-full text-left p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[14px] font-semibold text-gray-900">{s.name}</h3>
                          {s.popular && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">Popular</span>}
                        </div>
                        <p className="text-[12px] text-gray-500 mt-0.5">{s.description.slice(0, 80)}…</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.estimatedHours < 24 ? `${s.estimatedHours}h` : `${Math.round(s.estimatedHours / 24)}d`}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${s.basePrice.toFixed(2)} + ${s.pricePerKg}/kg</span>
                          <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-500" />{s.co2Estimate} kg CO₂/kg</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Shipment details</h2>
              <p className="text-[13px] text-gray-500 mb-4">Provide pickup and delivery information for <span className="text-gray-900 font-medium">{svc?.name}</span>.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Pickup location</label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 appearance-none transition-all">
                    <option value="" className="bg-white">Select origin…</option>
                    {cities.map((c) => <option key={c} value={c} className="bg-white">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Delivery location</label>
                  <select value={dest} onChange={(e) => setDest(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 appearance-none transition-all">
                    <option value="" className="bg-white">Select destination…</option>
                    {cities.filter((c) => c !== origin).map((c) => <option key={c} value={c} className="bg-white">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Pickup date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0.1" step="0.1" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Number of items</label>
                    <input type="number" value={items} onChange={(e) => setItems(e.target.value)} min="1" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Special instructions (optional)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Fragile items, preferred time window, etc." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none transition-all" />
                </div>
                {origin && dest && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[11px] text-gray-500 mb-1">Estimated cost</p>
                    <p className="text-[28px] font-bold text-gray-900">${cost.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600 font-medium">{co2.toFixed(1)} kg CO₂</span> estimated</span>
                      <span>~{svc ? (svc.estimatedHours < 24 ? `${svc.estimatedHours}h` : `${Math.round(svc.estimatedHours / 24)} days`) : "—"}</span>
                    </div>
                  </div>
                )}
                <button onClick={() => setStep("confirm")} disabled={!origin || !dest || !date} className="w-full py-3 rounded-xl text-[14px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-emerald-200">
                  Continue to confirmation<ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }} className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">Booking confirmed!</h2>
              <p className="text-[13px] text-gray-500 mb-4">Your {svc?.name} shipment from {origin} to {dest} has been scheduled.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[12px] text-gray-500 font-mono">ECN-{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
              <p className="text-[12px] text-gray-400 mt-4">Redirecting to your bookings…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
