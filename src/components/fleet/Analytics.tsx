"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { customerStats, bookings, pastShipments } from "@/data/demo";
import {
  Package,
  Truck,
  DollarSign,
  Leaf,
  Star,
  Clock,
  TrendingUp,
  ArrowRight,
  Zap,
  Calendar,
  MapPin,
} from "lucide-react";

// Simulated monthly spending data
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(1) : p.value}</span>
        </p>
      ))}
    </div>
  );
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>
    </motion.div>
  );
}

export default function DashboardOverview() {
  const activeBookings = bookings.filter((b) => b.status === "in-transit" || b.status === "confirmed");
  const recentActivity = [...bookings].sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)).slice(0, 4);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
        <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Here&apos;s an overview of your Eco Fleet Command account.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Package} label="Total Bookings" value={customerStats.totalBookings.toString()} sub={`Since ${customerStats.memberSince}`} color="#10b981" delay={0} />
        <StatCard icon={Truck} label="Active Shipments" value={customerStats.activeShipments.toString()} sub="In transit or confirmed" color="#3b82f6" delay={0.05} />
        <StatCard icon={DollarSign} label="Total Spent" value={`$${customerStats.totalSpent.toLocaleString()}`} sub="Across all bookings" color="#a78bfa" delay={0.1} />
        <StatCard icon={Leaf} label="CO₂ Saved" value={`${customerStats.co2Saved} kg`} sub="Through eco choices" color="#06b6d4" delay={0.15} />
      </div>

      {/* Active shipments */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Active Shipments
          </h3>
          <span className="text-[10px] text-muted-foreground">{activeBookings.length} in progress</span>
        </div>
        <div className="space-y-2">
          {activeBookings.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{b.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 font-medium">{b.status}</span>
                </div>
                <p className="text-xs text-foreground truncate">{b.origin} → {b.destination}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-foreground">{b.estimatedDelivery}</p>
                <p className="text-[10px] text-muted-foreground">{b.serviceName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Spending</h3>
          <p className="text-[11px] text-muted-foreground mb-3">Your shipping costs over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlySpending}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" name="Spent ($)" stroke="#10b981" fill="url(#spendGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold text-foreground mb-1">CO₂ Impact</h3>
          <p className="text-[11px] text-muted-foreground mb-3">Carbon savings from eco choices</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={co2ByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="kg CO₂ saved" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Recent Activity
        </h3>
        <div className="space-y-2">
          {recentActivity.map((b) => (
            <div key={b.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                b.status === "delivered" ? "bg-emerald-500" : b.status === "in-transit" ? "bg-blue-500" : b.status === "cancelled" ? "bg-gray-500" : "bg-amber-500"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">{b.serviceName} — {b.origin} → {b.destination}</p>
                <p className="text-[10px] text-muted-foreground">{b.id} · {b.scheduledDate}</p>
              </div>
              <span className="text-xs font-medium text-foreground">${b.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
