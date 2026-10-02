"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  Wallet, CreditCard, Plus, Check, Shield, ArrowRight, Download, Zap,
  AlertTriangle, Receipt, Lock, X,
} from "lucide-react";
import {
  invoices as demoInvoices,
  paymentMethods as demoMethods,
  paymentHistory as demoRecords,
  monthlyBilling,
  customerStats,
} from "@/data/demo";
import type { Invoice, PaymentMethod, PaymentRecord, PaymentMethodBrand } from "@/data/demo";

const usd = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const brandInfo: Record<PaymentMethodBrand, { label: string; grad: string; text: string }> = {
  visa: { label: "VISA", grad: "from-blue-600 to-blue-900", text: "text-white" },
  mastercard: { label: "mastercard", grad: "from-orange-500 to-red-700", text: "text-white" },
  amex: { label: "AMEX", grad: "from-cyan-600 to-teal-800", text: "text-white" },
  wallet: { label: "Eco Wallet", grad: "from-emerald-500 to-green-700", text: "text-white" },
};

const statusBadge: Record<Invoice["status"], string> = {
  paid: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20",
  due: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20",
  overdue: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20",
};

function CardFace({ m, compact }: { m: PaymentMethod; compact?: boolean }) {
  const b = brandInfo[m.brand];
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${b.grad} ${b.text} ${compact ? "p-3.5" : "p-4"} shadow-md`}>
      <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 top-10 w-16 h-16 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between mb-4">
        <div className="w-9 h-7 rounded-md bg-yellow-300/80 border border-yellow-200/60" />
        <span className="text-[12px] font-bold tracking-wide italic">{b.label}</span>
      </div>
      <p className="relative font-mono text-[15px] tracking-[0.18em] mb-3">
        {m.brand === "wallet" ? "•••• •••• •••• ••••" : `•••• •••• •••• ${m.last4}`}
      </p>
      <div className="relative flex items-center justify-between text-[10px] uppercase tracking-wider opacity-90">
        <span>{m.holder}</span>
        <span>{m.expiry}</span>
      </div>
      {m.isDefault && (
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-white/25 px-2 py-0.5 rounded-full tracking-wider">DEFAULT</span>
      )}
    </div>
  );
}

/* ── Pay modal ──────────────────────────────────────────────────────────── */
type PayTarget = { type: "single"; invoice: Invoice } | { type: "all" };

function PayModal({
  target, methods, amount, onClose, onPaid,
}: {
  target: PayTarget; methods: PaymentMethod[]; amount: number;
  onClose: () => void; onPaid: (methodId: string) => void;
}) {
  const [methodId, setMethodId] = useState<string>(() => methods.find((m) => m.isDefault)?.id ?? methods[0]?.id ?? "");
  const [phase, setPhase] = useState<"select" | "processing" | "done">("select");
  const selectable = methods.filter((m) => m.brand !== "wallet");
  const label = target.type === "single" ? target.invoice.id : "All outstanding invoices";

  const handlePay = () => {
    setPhase("processing");
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => onPaid(methodId), 1500);
    }, 1300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={phase === "select" ? onClose : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1a1f2e] rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-2xl p-6"
      >
        {phase === "select" && (
          <>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-[17px] font-bold text-gray-900 dark:text-gray-100">Pay Eco Fleet Command</h3>
              <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-5">{label}</p>

            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 mb-5 text-center">
              <p className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Amount due</p>
              <p className="text-[30px] font-bold text-gray-900 dark:text-gray-100 leading-none">{usd(amount)}</p>
            </div>

            <p className="text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-2">Pay with</p>
            <div className="space-y-2 mb-5">
              {selectable.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethodId(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    methodId === m.id
                      ? "border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10"
                      : "border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                >
                  <div className={`w-10 h-7 rounded-md bg-gradient-to-br ${brandInfo[m.brand].grad} flex items-center justify-center shrink-0`}>
                    <span className="text-[8px] font-bold text-white">{brandInfo[m.brand].label.slice(0, 4)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 font-mono">{m.brand === "wallet" ? "Eco Wallet" : `•••• ${m.last4}`}</p>
                    <p className="text-[11px] text-gray-400">Expires {m.expiry}</p>
                  </div>
                  <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${methodId === m.id ? "border-emerald-500 bg-emerald-500" : "border-gray-300 dark:border-gray-600"}`}>
                    {methodId === m.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={!methodId}
              className="w-full py-3 rounded-xl text-[14px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20"
            >
              Pay {usd(amount)}<Lock className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-3">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Secured with 256-bit SSL encryption
            </div>
          </>
        )}

        {phase === "processing" && (
          <div className="py-10 text-center">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mx-auto mb-4" />
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-1">Processing payment…</h3>
            <p className="text-[12px] text-gray-400">Do not close this window.</p>
          </div>
        )}

        {phase === "done" && (
          <div className="py-10 text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h3 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 mb-1">Payment successful</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">{usd(amount)} paid to Eco Fleet Command.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Add card form ──────────────────────────────────────────────────────── */
function AddCardForm({ onAdd, onCancel }: { onAdd: (m: Omit<PaymentMethod, "id">) => void; onCancel: () => void }) {
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 2 ? d.slice(0, 2) + " / " + d.slice(2) : d; };
  const valid = number.replace(/\D/g, "").length === 16 && holder && expiry.length === 7 && cvc.length >= 3;

  const submit = () => {
    if (!valid) return;
    const digits = number.replace(/\D/g, "");
    const brand: PaymentMethodBrand = digits[0] === "4" ? "visa" : digits[0] === "3" ? "amex" : "mastercard";
    onAdd({ brand, last4: digits.slice(-4), holder, expiry, isDefault: false });
  };

  const inputCls = "w-full px-3 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-[13px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all";

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="p-4 rounded-2xl border border-dashed border-emerald-200 dark:border-emerald-500/25 bg-emerald-50/40 dark:bg-emerald-500/[0.06] space-y-3 mt-3">
        <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Add a card</p>
        <input value={number} onChange={(e) => setNumber(fmtCard(e.target.value))} placeholder="Card number" maxLength={19} className={`${inputCls} font-mono`} />
        <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Cardholder name" className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <input value={expiry} onChange={(e) => setExpiry(fmtExp(e.target.value))} placeholder="MM / YY" maxLength={7} className={`${inputCls} font-mono`} />
          <input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVC" maxLength={4} className={`${inputCls} font-mono`} />
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={submit} disabled={!valid} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 transition-all">Save card</button>
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] transition-all">Cancel</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Billing ────────────────────────────────────────────────────────────── */
export default function Billing() {
  const [invList, setInvList] = useState<Invoice[]>(demoInvoices);
  const [methods, setMethods] = useState<PaymentMethod[]>(demoMethods);
  const [records, setRecords] = useState<PaymentRecord[]>(demoRecords);
  const [filter, setFilter] = useState<"all" | "due" | "paid">("all");
  const [target, setTarget] = useState<PayTarget | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [autopay, setAutopay] = useState(true);

  const outstanding = useMemo(
    () => invList.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0),
    [invList]
  );
  const overdueList = invList.filter((i) => i.status === "overdue");
  const paidThisYear = useMemo(() => customerStats.totalSpent, []);
  const filtered = invList.filter((i) =>
    filter === "all" ? true : filter === "due" ? i.status !== "paid" : i.status === "paid"
  );

  const modalAmount = !target ? 0 : target.type === "single" ? target.invoice.amount : outstanding;

  const handlePaid = (methodId: string) => {
    const method = methods.find((m) => m.id === methodId);
    const methodName = method ? (method.brand === "wallet" ? "Eco Wallet" : `${brandInfo[method.brand].label} •• ${method.last4}`) : "Card";
    const paidIds = target?.type === "single" ? [target.invoice.id] : invList.filter((i) => i.status !== "paid").map((i) => i.id);

    setInvList((prev) =>
      prev.map((i) => (paidIds.includes(i.id) ? { ...i, status: "paid" as const, paidWith: method?.brand } : i))
    );
    setRecords((prev) => [
      ...invList
        .filter((i) => paidIds.includes(i.id))
        .map((i, idx) => ({
          id: `pay_new_${Date.now()}_${idx}`,
          invoiceId: i.id,
          date: "Today",
          amount: i.amount,
          method: methodName,
          status: "completed" as const,
        })),
      ...prev,
    ]);
    setTarget(null);
  };

  const outstandingCount = invList.filter((i) => i.status !== "paid").length;

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-6 space-y-5">
      {/* Header + outstanding hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white shadow-lg shadow-emerald-500/15"
        >
          <div className="absolute -right-10 -top-14 w-52 h-52 rounded-full bg-white/10" />
          <div className="absolute -right-4 top-20 w-28 h-28 rounded-full bg-white/10" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Wallet className="w-4 h-4" /></div>
                <span className="text-[12px] font-semibold uppercase tracking-wider text-emerald-100">Outstanding balance</span>
              </div>
              <p className="text-[36px] font-bold leading-none mb-1.5">{usd(outstanding)}</p>
              <p className="text-[13px] text-emerald-100/90">
                {outstandingCount === 0 ? "All invoices are settled 🎉" : `${outstandingCount} invoice${outstandingCount > 1 ? "s" : ""} awaiting payment · due to Eco Fleet Command`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end shrink-0">
              <button
                onClick={() => outstandingCount > 0 && setTarget({ type: "all" })}
                disabled={outstandingCount === 0}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 text-[13px] font-bold hover:bg-emerald-50 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Pay all<ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-emerald-100/80 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Secure payments</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-white/[0.06] p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">Auto-pay</span>
            <button
              onClick={() => setAutopay(!autopay)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autopay ? "bg-emerald-500" : "bg-gray-200 dark:bg-white/10"}`}
              aria-label="Toggle auto-pay"
            >
              <motion.span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow"
                animate={{ x: autopay ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {autopay
              ? "Cards are charged automatically when an invoice becomes due."
              : "Auto-pay is off. You'll need to pay each invoice manually."}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] p-3">
              <p className="text-[16px] font-bold text-gray-900 dark:text-gray-100">{usd(paidThisYear)}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Paid to date</p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] p-3">
              <p className="text-[16px] font-bold text-gray-900 dark:text-gray-100">{overdueList.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Overdue</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left: invoices + history */}
        <div className="lg:col-span-2 space-y-5">
          {/* Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center"><Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                Invoices
              </h3>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/[0.06]">
                {(["all", "due", "paid"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-all ${
                      filter === f ? "bg-white dark:bg-white/[0.1] text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-0">
              {filtered.length === 0 && (
                <p className="text-[13px] text-gray-400 py-8 text-center">No invoices in this view.</p>
              )}
              {filtered.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
                  className={`flex flex-wrap items-center gap-4 py-3.5 ${i < filtered.length - 1 ? "border-b border-gray-100 dark:border-white/[0.06]" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    inv.status === "paid" ? "bg-emerald-50 dark:bg-emerald-500/15" : inv.status === "overdue" ? "bg-red-50 dark:bg-red-500/15" : "bg-amber-50 dark:bg-amber-500/15"
                  }`}>
                    {inv.status === "paid"
                      ? <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      : <AlertTriangle className={`w-5 h-5 ${inv.status === "overdue" ? "text-red-500" : "text-amber-500"}`} />}
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[13px] font-mono font-semibold text-gray-900 dark:text-gray-100">{inv.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide border ${statusBadge[inv.status]}`}>
                        {inv.status === "due" ? "due " + inv.due : inv.status}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-600 dark:text-gray-400 truncate">{inv.serviceName} · {inv.description}</p>
                    <p className="text-[11px] text-gray-400">Issued {inv.issued} · Booking {inv.bookingId}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{usd(inv.amount)}</p>
                    {inv.paidWith && <p className="text-[10px] text-gray-400 uppercase tracking-wide">via {inv.paidWith}</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {inv.status !== "paid" ? (
                      <button
                        onClick={() => setTarget({ type: "single", invoice: inv })}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-[12px] font-semibold hover:bg-emerald-600 active:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all"
                      >
                        Pay now
                      </button>
                    ) : (
                      <button className="p-2 rounded-xl bg-gray-50 dark:bg-white/[0.05] border border-gray-100 dark:border-white/[0.06] text-gray-400 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all" title="Download receipt">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment history */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
          >
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center"><CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
              Payment history
            </h3>
            <div className="space-y-0">
              {records.slice(0, 8).map((r, i) => (
                <div key={r.id} className={`flex items-center gap-4 py-3 ${i < Math.min(records.length, 8) - 1 ? "border-b border-gray-100 dark:border-white/[0.06]" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 font-mono">{r.invoiceId}</p>
                    <p className="text-[11px] text-gray-400">{r.date} · {r.method}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide border shrink-0 ${
                    r.status === "completed"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20"
                      : r.status === "processing"
                      ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20"
                      : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-white/[0.06] dark:text-gray-400 dark:border-white/[0.08]"
                  }`}>{r.status}</span>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 w-20 text-right shrink-0">{usd(r.amount)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: payment methods + spend chart */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}
            className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Payment methods</h3>
              <button
                onClick={() => setShowAddCard((v) => !v)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-3">
              {methods.map((m) => (
                <div key={m.id} className="group relative">
                  <CardFace m={m} />
                </div>
              ))}
            </div>

            <AnimatePresence>
              {showAddCard && (
                <AddCardForm
                  onCancel={() => setShowAddCard(false)}
                  onAdd={(m) => {
                    setMethods((prev) => [...prev, { ...m, id: `pm_${Date.now()}` }]);
                    setShowAddCard(false);
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }}
            className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Monthly billing</h3>
              <span className="text-[11px] text-gray-400 bg-gray-50 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg border border-gray-100 dark:border-white/[0.08] font-medium">Last 6 months</span>
            </div>
            <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">What you've been billed</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyBilling}>
                <defs>
                  <linearGradient id="billGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16B364" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16B364" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  formatter={(value: any) => [typeof value === "number" ? usd(value) : String(value), "Billed"]}
                  contentStyle={{
                    background: "#111827", border: "none", borderRadius: 12,
                    fontSize: 12, color: "#fff", padding: "8px 12px",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Area type="monotone" dataKey="value" stroke="#16B364" fill="url(#billGrad)" strokeWidth={2.5} dot={{ r: 3, fill: "#16B364", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {target && (
          <PayModal
            target={target}
            methods={methods}
            amount={modalAmount}
            onClose={() => setTarget(null)}
            onPaid={handlePaid}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
