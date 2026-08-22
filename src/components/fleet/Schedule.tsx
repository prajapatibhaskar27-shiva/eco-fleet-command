"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  catalog, indiaCities, shipmentVehicles, shipmentTypes,
  type CatalogItem, type IndiaCity,
} from "@/data/demo";
import {
  Calendar, Clock, ChevronRight, ArrowLeft, Check, DollarSign, Leaf,
  MapPin, Search, Truck, Ship, Package, ArrowRight, Globe,
} from "lucide-react";
import IndiaMap from "./IndiaMap";

interface ScheduleProps { preselectedServiceId?: string | null; onComplete: () => void; }

/* ── Searchable city dropdown ───────────────────────────────────────────── */
function CityDropdown({
  label, value, onChange, exclude, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  exclude?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return indiaCities.filter(
      (c) => c.name !== exclude && (c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)),
    );
  }, [query, exclude]);

  const selected = indiaCities.find((c) => c.name === value);

  return (
    <div ref={ref} className="relative">
      <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all flex items-center justify-between"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? `${selected.name}, ${selected.state}` : placeholder || "Select city…"}
        </span>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city or state..."
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((city) => (
              <button
                key={city.name}
                onClick={() => { onChange(city.name); setOpen(false); setQuery(""); }}
                className={`w-full text-left px-3 py-2 text-[12px] hover:bg-emerald-50 transition-colors flex items-center gap-2 ${
                  city.name === value ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700"
                }`}
              >
                <MapPin className={`w-3 h-3 shrink-0 ${city.hub ? "text-emerald-500" : "text-gray-300"}`} />
                <div>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-gray-400 ml-1.5">{city.state}</span>
                  {city.hub && <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-600 font-bold">HUB</span>}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-[12px] text-gray-400">No cities found</div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Haversine distance ─────────────────────────────────────────────────── */
function getDistanceKm(a: IndiaCity, b: IndiaCity): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

/* ── Main Schedule Component ────────────────────────────────────────────── */
export default function Schedule({ preselectedServiceId, onComplete }: ScheduleProps) {
  const [step, setStep] = useState<"service" | "india-details" | "confirm">(
    preselectedServiceId ? "india-details" : "service"
  );
  const [svc, setSvc] = useState<CatalogItem | null>(
    preselectedServiceId ? catalog.find((s) => s.id === preselectedServiceId) ?? null : null
  );

  // India shipping fields
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [shipType, setShipType] = useState("");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("5");
  const [items, setItems] = useState("1");
  const [notes, setNotes] = useState("");

  // Derived
  const originCity = indiaCities.find((c) => c.name === origin);
  const destCity = indiaCities.find((c) => c.name === dest);
  const distance = originCity && destCity ? getDistanceKm(originCity, destCity) : 0;
  const vehicleData = shipmentVehicles.find((v) => v.id === vehicle);
  const typeData = shipmentTypes.find((t) => t.id === shipType);

  const baseCost = vehicleData && distance ? distance * vehicleData.pricePerKm : 0;
  const totalCost = baseCost * (typeData?.multiplier || 1);
  const totalCo2 = vehicleData && distance ? distance * vehicleData.co2PerKm * 0.01 : 0;
  const estDays = vehicleData && distance
    ? distance < 300 ? 0.5
    : distance < 800 ? 1
    : distance < 1500 ? 2
    : distance < 3000 ? 3
    : 5
    : 0;

  const handleService = (s: CatalogItem) => { setSvc(s); setStep("india-details"); };
  const handleConfirm = () => { setStep("confirm"); setTimeout(onComplete, 2000); };

  const canProceed = origin && dest && vehicle && shipType && date;

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Back button */}
        {step === "india-details" && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep("service")}
            className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />Back
          </motion.button>
        )}

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-6">
          {["service", "india-details", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === s ? "bg-emerald-500 text-white"
                : ["service", "india-details", "confirm"].indexOf(step) > i ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-400"
              }`}>
                {["service", "india-details", "confirm"].indexOf(step) > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[12px] ${step === s ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                {s === "service" ? "Service" : s === "india-details" ? "Ship Anywhere in India" : "Confirm"}
              </span>
              {i < 2 && <div className="w-8 h-[1px] bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Service ───────────────────────────────────────── */}
          {step === "service" && (
            <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Choose a service</h2>
              <p className="text-[13px] text-gray-500 mb-4">Select the shipping option that fits your needs.</p>

              {/* India quick option */}
              <button
                onClick={() => { setStep("india-details"); }}
                className="w-full text-left p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition-all mb-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold text-gray-900">Ship Anywhere in India</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold uppercase">30 Cities</span>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5">Enter pickup and delivery anywhere across India — choose vehicle, type, and see your route on the live map.</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-[1px] bg-gray-200" />
                <span className="text-[11px] text-gray-400">or choose a catalog service</span>
                <div className="flex-1 h-[1px] bg-gray-200" />
              </div>

              <div className="space-y-2">
                {catalog.map((s) => (
                  <button key={s.id} onClick={() => handleService(s)} className="w-full text-left p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all">
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

          {/* ── Step 2: India Details ────────────────────────────────── */}
          {step === "india-details" && (
            <motion.div key="india-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-5">
                <h2 className="text-[20px] font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  Ship Anywhere in India
                </h2>
                <p className="text-[13px] text-gray-500">
                  {svc
                    ? <>Continue booking with <span className="text-gray-900 font-medium">{svc.name}</span> — select locations on the map.</>
                    : <>Select pickup and delivery cities, choose vehicle and shipment type, then confirm your booking.</>
                  }
                </p>
              </div>

              <div className="space-y-5">
                {/* Map */}
                <IndiaMap
                  origin={origin}
                  destination={dest}
                  onSelectOrigin={setOrigin}
                  onSelectDestination={setDest}
                />

                {/* City Selection (searchable dropdowns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CityDropdown
                    label="Pickup City"
                    value={origin}
                    onChange={setOrigin}
                    exclude={dest}
                    placeholder="Select pickup city…"
                  />
                  <CityDropdown
                    label="Delivery City"
                    value={dest}
                    onChange={setDest}
                    exclude={origin}
                    placeholder="Select delivery city…"
                  />
                </div>

                {/* Route preview */}
                {originCity && destCity && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-[13px] font-semibold text-gray-900">{origin}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <span className="text-[13px] font-semibold text-gray-900">{dest}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-[18px] font-bold text-emerald-600">{distance.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Kilometers</p>
                      </div>
                      <div>
                        <p className="text-[18px] font-bold text-gray-900">~{estDays} {estDays === 0.5 ? "day" : "days"}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Est. Transit</p>
                      </div>
                      <div>
                        <p className="text-[18px] font-bold text-emerald-600">{totalCo2 > 0 ? `${totalCo2.toFixed(1)} kg` : "Zero"}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">CO₂ Emissions</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Vehicle selection */}
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-2 block">Select Vehicle</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {shipmentVehicles.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVehicle(v.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          vehicle === v.id
                            ? "border-emerald-300 bg-emerald-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{v.icon}</span>
                          <span className="text-[12px] font-semibold text-gray-900">{v.name}</span>
                          {v.co2PerKm === 0 && <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">ZERO CO₂</span>}
                        </div>
                        <p className="text-[10px] text-gray-500">{v.capacity} · {v.speed}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">₹{v.pricePerKm}/km</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipment type */}
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-2 block">Shipment Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {shipmentTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setShipType(t.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          shipType === t.id
                            ? "border-emerald-300 bg-emerald-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{t.icon}</span>
                          <span className="text-[12px] font-semibold text-gray-900">{t.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{t.description.slice(0, 60)}…</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {t.features.slice(0, 2).map((f) => (
                            <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{f}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Pickup Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="0.1"
                      step="0.1"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Items</label>
                    <input
                      type="number"
                      value={items}
                      onChange={(e) => setItems(e.target.value)}
                      min="1"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[12px] font-medium text-gray-600 mb-1.5 block">Special Instructions (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Fragile items, preferred time window, loading dock access…"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none transition-all"
                  />
                </div>

                {/* Cost summary */}
                {origin && dest && vehicle && shipType && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Booking Summary</h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-[12px] text-gray-600">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>{origin} → {dest}</span>
                        <span className="text-gray-400">({distance.toLocaleString()} km)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-gray-600">
                        <Truck className="w-3 h-3 text-gray-400" />
                        <span>{vehicleData?.icon} {vehicleData?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-gray-600">
                        <Package className="w-3 h-3 text-gray-400" />
                        <span>{typeData?.icon} {typeData?.name} shipment · {weight} kg</span>
                      </div>
                    </div>
                    <div className="h-[1px] bg-gray-200 mb-3" />
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[11px] text-gray-500">Estimated cost</p>
                        <p className="text-[28px] font-bold text-gray-900 leading-none">
                          ₹{Math.round(totalCost).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-gray-500">CO₂ impact</p>
                        <p className={`text-[14px] font-bold ${totalCo2 === 0 ? "text-emerald-600" : "text-gray-700"}`}>
                          {totalCo2 === 0 ? "Zero emissions" : `${totalCo2.toFixed(1)} kg CO₂`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Continue button */}
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!canProceed}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
                >
                  Confirm Booking<ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Confirmation ─────────────────────────────────── */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">Booking confirmed!</h2>
              <p className="text-[13px] text-gray-500 mb-2">
                Your {vehicleData?.name || svc?.name || "shipping"} from {origin || "origin"} to {dest || "destination"} has been scheduled.
              </p>
              <p className="text-[12px] text-gray-400 mb-4">
                Pickup on {date} · ~{estDays} {estDays === 0.5 ? "day" : "days"} transit
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[12px] text-gray-500 font-mono">
                ECN-{Math.random().toString(36).slice(2, 8).toUpperCase()}
              </div>
              <p className="text-[12px] text-gray-400 mt-4">Redirecting to your bookings…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
