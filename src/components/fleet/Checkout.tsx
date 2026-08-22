"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  Shield,
  Leaf,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
} from "lucide-react";

interface CheckoutProps {
  serviceName: string;
  origin: string;
  destination: string;
  weight: string;
  items: string;
  estimatedCost: number;
  estimatedCo2: number;
  onComplete: () => void;
}

export default function Checkout({ serviceName, origin, destination, weight, items, estimatedCost, estimatedCo2, onComplete }: CheckoutProps) {
  const [step, setStep] = useState<"summary" | "payment" | "done">("summary");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("done");
      setTimeout(() => onComplete(), 2000);
    }, 1500);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-lg mx-auto p-4 sm:p-6">
        {/* Back */}
        {step === "payment" && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep("summary")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {step === "summary" && (
            <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-foreground mb-1">Order summary</h2>
              <p className="text-sm text-muted-foreground mb-6">Review your booking before payment.</p>

              {/* Order details */}
              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{serviceName}</h3>
                      <p className="text-[11px] text-muted-foreground">{weight} kg · {items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{origin}</span>
                    <span className="text-emerald-500">→</span>
                    <span>{destination}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price</span>
                    <span className="text-foreground">${(estimatedCost * 0.4).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weight charge ({weight} kg)</span>
                    <span className="text-foreground">${(estimatedCost * 0.6).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="text-foreground">$2.00</span>
                  </div>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${(estimatedCost + 2).toFixed(2)}</span>
                  </div>
                </div>

                {/* Eco badge */}
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    This shipment saves approximately <span className="text-emerald-400 font-semibold">{estimatedCo2.toFixed(1)} kg CO₂</span> compared to standard options.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                Proceed to payment
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-foreground mb-1">Payment</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your card details to complete the booking.</p>

              <div className="space-y-4">
                {/* Card number */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Card number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cardholder name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      maxLength={7}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CVC</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit SSL encryption. Your card details are never stored on our servers.</span>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePayment}
                  disabled={processing || cardNumber.length < 19 || !cardName || expiry.length < 7 || cvc.length < 3}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Pay ${(estimatedCost + 2).toFixed(2)}
                      <Lock className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">Payment successful</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Your booking for <span className="text-foreground font-medium">{serviceName}</span> has been confirmed.
              </p>
              <p className="text-xs text-muted-foreground">Redirecting to your dashboard…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
