"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { customerStats, bookings, shipCargoBookings, cargoTypeLabels, cargoStatusLabels } from "@/data/demo";
import { Package, Truck, DollarSign, Leaf, Ship, Anchor, TrendingUp, Fuel } from "lucide-react";

const monthlySpending = [
  { month: "Mar", value: 180 },
  { month: "Apr", value: 245 },
  { month: "May", value: 310 },
  { month: "Jun", value: 275 },
  { month: "Jul", value: 390 },
  { month: "Aug", value: 447 },
];

const co2ByMonth = [
  { month: "Mar", value: 3.2 },
  { month: "Apr", value: 5.8 },
  { month: "May", value: 7.1 },
  { month: "Jun", value: 6.4 },
  { month: "Jul", value: 10.2 },
  { month: "Aug", value: 9.9 },
];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-black/40 border border-gray-100 dark:border-white/[0.08] px-3 py-2 text-xs">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-gray-900 font-semibold">
          {p.name}: {typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

function StatCard({
  icon: Icon, value, label, sub, iconBg, iconColor, delay,
}: {
  icon: any; value: string; label: string; sub: string; iconBg: string; iconColor: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5 hover:shadow-md hover:shadow-gray-100 dark:hover:shadow-black/20 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-105 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-[28px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{value}</p>
      <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium">{label}</p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
    </motion.div>
  );
}

export default function DashboardOverview() {
  const activeBookings = bookings.filter((b) => b.status === "in-transit" || b.status === "confirmed");
  const activeCargo = shipCargoBookings.filter((b) => b.status === "in-transit");
  const totalCargoTonnage = shipCargoBookings.reduce((sum, c) => sum + c.cargoWeight, 0);
  const totalCargoCO2 = shipCargoBookings.reduce((sum, c) => sum + c.co2Saved, 0);

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-6 space-y-5">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-[22px] font-bold text-gray-900 dark:text-gray-100">Welcome back</h2>
        <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-0.5">Here's an overview of your Eco Fleet Command account.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          value={customerStats.totalBookings.toString()}
          label="Total Bookings"
          sub={`Since ${customerStats.memberSince}`}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0}
        />
        <StatCard
          icon={Truck}
          value={customerStats.activeShipments.toString()}
          label="Active Shipments"
          sub="In transit or confirmed"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0.05}
        />
        <StatCard
          icon={DollarSign}
          value={`$${customerStats.totalSpent.toLocaleString()}`}
          label="Total Spent"
          sub="Across all bookings"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0.1}
        />
        <StatCard
          icon={Leaf}
          value={`${customerStats.co2Saved} kg`}
          label="CO₂ Saved"
          sub="Through eco choices"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          delay={0.15}
        />
      </div>

      {/* Ship Cargo Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-xl border border-blue-100 dark:border-blue-500/15 p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center"><Ship className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" /></div>
          <div><p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{shipCargoBookings.length}</p><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cargo Voyages</p></div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-xl border border-blue-100 dark:border-blue-500/15 p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center"><Anchor className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" /></div>
          <div><p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{activeCargo.length}</p><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">In Transit</p></div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/15 p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center"><Fuel className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" /></div>
          <div><p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{(totalCargoTonnage / 1000).toFixed(0)}k t</p><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tonnage</p></div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/15 p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center"><Leaf className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" /></div>
          <div><p className="text-[18px] font-bold text-emerald-700 dark:text-emerald-400">{totalCargoCO2.toFixed(0)} kg</p><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cargo CO₂ Saved</p></div>
        </div>
      </motion.div>

      {/* Active Shipments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Active Shipments
          </h3>
          <span className="text-[12px] text-gray-400 font-medium">{activeBookings.length} in progress</span>
        </div>
        <div className="space-y-0">
          {activeBookings.map((b, i) => (
            <div key={b.id} className={`flex items-center gap-4 py-3.5 ${i < activeBookings.length - 1 ? "border-b border-gray-100 dark:border-white/[0.06]" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-mono font-semibold text-gray-900 dark:text-gray-100">{b.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${b.status === "in-transit" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>{b.status}</span>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">{b.origin} <span className="text-gray-300 dark:text-gray-600 mx-1">→</span> {b.destination}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{b.estimatedDelivery}</p>
                <p className="text-[11px] text-gray-400">{b.serviceName}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Active Ship Cargo */}
      {activeCargo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
                <Ship className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Active Ship Cargo
            </h3>
            <span className="text-[12px] text-gray-400 font-medium">{activeCargo.length} voyages</span>
          </div>
          <div className="space-y-0">
            {activeCargo.map((c, i) => {
              const statusInfo = cargoStatusLabels[c.status];
              const cargoInfo = cargoTypeLabels[c.cargoType];
              return (
                <div key={c.id} className={`flex items-center gap-4 py-3.5 ${i < activeCargo.length - 1 ? "border-b border-gray-100 dark:border-white/[0.06]" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                    <Ship className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-mono font-semibold text-gray-900 dark:text-gray-100">{c.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide border ${statusInfo.bg} ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400">{c.originPort} <span className="text-gray-300 dark:text-gray-600 mx-1">→</span> {c.destinationPort}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{c.estimatedDelivery}</p>
                    <p className="text-[11px] text-gray-400">{cargoInfo.icon} {c.cargoWeight.toLocaleString()} t</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Monthly Spending</h3>
            <span className="text-[11px] text-gray-400 bg-gray-50 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg border border-gray-100 dark:border-white/[0.08] font-medium">This Year</span>
          </div>
          <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">Your shipping costs over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySpending}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16B364" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16B364" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f2" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={35} />
              {/* Axis colors handled by stroke */}
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Spent ($)" stroke="#16B364" fill="url(#spendGrad)" strokeWidth={2.5} dot={{ r: 3, fill: "#16B364", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#16B364", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* CO₂ Impact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">CO₂ Impact</h3>
            <span className="text-[11px] text-gray-400 bg-gray-50 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg border border-gray-100 dark:border-white/[0.08] font-medium">This Year</span>
          </div>
          <p className="text-[12px] text-gray-400 dark:text-gray-500 mb-4">Carbon savings from eco choices</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={co2ByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f2" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="kg CO₂" fill="#16B364" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
