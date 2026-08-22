"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  fuelUsage,
  co2Reduction,
  deliveryEfficiency,
  fleetUtilization,
  hourlyThroughput,
  fleetStats,
} from "@/data/demo";
import {
  Fuel,
  Leaf,
  Truck,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
} from "lucide-react";

type Tab = "overview" | "fuel" | "co2" | "efficiency" | "throughput";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-xs">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string;
  change: string;
  positive: boolean;
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
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

export default function Analytics() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "fuel", label: "Fuel" },
    { key: "co2", label: "CO₂" },
    { key: "efficiency", label: "Efficiency" },
    { key: "throughput", label: "Throughput" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Fleet Analytics
          </h2>
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {["Today", "Week", "Month"].map((p) => (
              <button
                key={p}
                className="px-3 py-1 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all first:bg-emerald-500/15 first:text-emerald-400 first:border first:border-emerald-500/20"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                tab === t.key
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                icon={Fuel}
                label="Daily Fuel Usage"
                value={`${fleetStats.fuelSaved} L saved`}
                change="-12% vs last week"
                positive={true}
                color="bg-emerald-500/15 text-emerald-400"
                delay={0}
              />
              <StatCard
                icon={Leaf}
                label="CO₂ Reduction"
                value={`${fleetStats.co2Saved} kg`}
                change="+18% this month"
                positive={true}
                color="bg-cyan-500/15 text-cyan-400"
                delay={0.05}
              />
              <StatCard
                icon={Target}
                label="On-Time Delivery"
                value={`${fleetStats.onTimeRate}%`}
                change="-0.8% vs last week"
                positive={false}
                color="bg-violet-500/15 text-violet-400"
                delay={0.1}
              />
              <StatCard
                icon={Truck}
                label="Fleet Utilization"
                value={`${fleetStats.avgUtilization}%`}
                change="+3.2% this week"
                positive={true}
                color="bg-amber-500/15 text-amber-400"
                delay={0.15}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Fuel Usage (Liters)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={fuelUsage}>
                    <defs>
                      <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" name="Liters" stroke="#10b981" fill="url(#fuelGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="text-sm font-semibold text-foreground mb-3">CO₂ Reduction (kg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={co2Reduction}>
                    <defs>
                      <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="kg CO₂" fill="url(#co2Grad)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {tab === "fuel" && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Weekly Fuel Consumption</h3>
            <p className="text-xs text-muted-foreground mb-4">Liters across fleet per day</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fuelUsage}>
                <defs>
                  <linearGradient id="fuelGradLg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="Liters" stroke="#10b981" fill="url(#fuelGradLg)" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "co2" && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-foreground mb-1">CO₂ Reduction Trend</h3>
            <p className="text-xs text-muted-foreground mb-4">Monthly CO₂ savings in kilograms</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={co2Reduction}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="kg CO₂" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "efficiency" && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Delivery Efficiency</h3>
            <p className="text-xs text-muted-foreground mb-4">On-time delivery rate by day</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" name="Efficiency %" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "throughput" && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Hourly Throughput</h3>
            <p className="text-xs text-muted-foreground mb-4">Deliveries and pickups by hour</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyThroughput}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="deliveries" name="Deliveries" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pickups" name="Pickups" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Fleet utilization mini chart (always visible) */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Fleet Utilization</h3>
          <p className="text-xs text-muted-foreground mb-4">Weekly utilization percentage</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={fleetUtilization}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" name="Utilization %" stroke="#a78bfa" fill="url(#utilGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
