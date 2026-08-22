"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { catalog, type CatalogItem } from "@/data/demo";
import {
  Calendar,
  MapPin,
  Package,
  Clock,
  ChevronRight,
  ArrowLeft,
  Check,
  DollarSign,
  Leaf,
  Zap,
  Truck,
} from "lucide-react";

interface ScheduleProps {
  preselectedServiceId?: string | null;
  onComplete: () => void;
}

const cities = [
  "San Francisco, CA",
  "Los Angeles, CA",
  "Seattle, WA",
  "Portland, OR",
  "Denver, CO",
  "Austin, TX",
  "Chicago, IL",
  "New York, NY",
  "Boston, MA",
  "Phoenix, AZ",
  "Houston, TX",
  "Dallas, TX",
  "Miami, FL",
  "Orlando, FL",
  "Salt Lake City, UT",
  "Sacramento, CA",
  "San Jose, CA",
];

export default function Schedule({ preselectedServiceId, onComplete }: ScheduleProps) {
  const [step, setStep] = useState<"service" | "details" | "confirm">(
    preselectedServiceId ? "details" : "service"
  );
  const [selectedService, setSelectedService] = useState<CatalogItem | null>(
    preselectedServiceId ? catalog.find((s) => s.id === preselectedServiceId) ?? null : null
  );
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("5");
  const [items, setItems] = useState("1");
  const [notes, setNotes] = useState("");

  const estimatedCost = selectedService
    ? selectedService.basePrice + selectedService.pricePerKg * parseFloat(weight || "0")
    : 0;

  const estimatedCo2 = selectedService
    ? selectedService.co2Estimate * parseFloat(weight || "0")
    : 0;

  const handleServiceSelect = (svc: CatalogItem) => {
    setSelectedService(svc);
    setStep("details");
  };

  const handleConfirm = () => {
    setStep("confirm");
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {/* Back */}
        {step !== "service" && step !== "confirm" && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep("service")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {["service", "details", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === s
                  ? "bg-emerald-500 text-white"
                    : (["service", "details", "confirm"].indexOf(step) > i)
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 text-muted-foreground"
              }`}>
                {(["service", "details", "confirm"].indexOf(step) > i) ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs ${step === s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s === "service" ? "Service" : s === "details" ? "Details" : "Confirm"}
              </span>
              {i < 2 && <div className="w-8 h-[1px] bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Service selection */}
          {step === "service" && (
            <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-foreground mb-1">Choose a service</h2>
              <p className="text-sm text-muted-foreground mb-4">Select the shipping option that fits your needs.</p>
              <div className="space-y-2">
                {catalog.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleServiceSelect(svc)}
                    className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{svc.name}</h3>
                          {svc.popular && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">Popular</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{svc.description.slice(0, 80)}…</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{svc.estimatedHours < 24 ? `${svc.estimatedHours}h` : `${Math.round(svc.estimatedHours / 24)}d`}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${svc.basePrice.toFixed(2)} + ${svc.pricePerKg}/kg</span>
                          <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-400" />{svc.co2Estimate} kg CO₂/kg</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-foreground mb-1">Shipment details</h2>
              <p className="text-sm text-muted-foreground mb-4">Provide pickup and delivery information for <span className="text-foreground font-medium">{selectedService?.name}</span>.</p>

              <div className="space-y-4">
                {/* Origin */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Pickup location</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none"
                  >
                    <option value="" className="bg-[#0a1120]">Select origin…</option>
                    {cities.map((c) => <option key={c} value={c} className="bg-[#0a1120]">{c}</option>)}
                  </select>
                </div>

                {/* Destination */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Delivery location</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none"
                  >
                    <option value="" className="bg-[#0a1120]">Select destination…</option>
                    {cities.filter((c) => c !== origin).map((c) => <option key={c} value={c} className="bg-[#0a1120]">{c}</option>)}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Pickup date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                {/* Weight & Items */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="0.1"
                      step="0.1"
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Number of items</label>
                    <input
                      type="number"
                      value={items}
                      onChange={(e) => setItems(e.target.value)}
                      min="1"
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Special instructions (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Fragile items, preferred time window, etc."
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                  />
                </div>

                {/* Cost estimate */}
                {origin && destination && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-muted-foreground mb-2">Estimated cost</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">${estimatedCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">{estimatedCo2.toFixed(1)} kg CO₂</span> estimated</span>
                      <span>~{selectedService ? (selectedService.estimatedHours < 24 ? `${selectedService.estimatedHours}h` : `${Math.round(selectedService.estimatedHours / 24)} days`) : "—"}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep("confirm")}
                  disabled={!origin || !destination || !date}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to confirmation
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">Booking confirmed!</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your {selectedService?.name} shipment from {origin} to {destination} has been scheduled.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground font-mono">
                ECN-{Math.random().toString(36).slice(2, 8).toUpperCase()}
              </div>
              <p className="text-xs text-muted-foreground mt-4">Redirecting to your bookings…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
