"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { vehicles, fleetStats, type Vehicle } from "@/data/demo";
import {
  Zap,
  Fuel,
  Thermometer,
  Activity,
  Battery,
  Truck,
  Wifi,
  WifiOff,
  Gauge,
  Leaf,
  Shield,
  Clock,
} from "lucide-react";

function PulseRing({ color, size }: { color: string; size: number }) {
  return (
    <span className="relative" style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative block rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  );
}

function MetricGauge({
  label,
  value,
  max,
  unit,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: any;
}) {
  const pct = (value / max) * 100;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-4 h-4 mb-0.5" style={{ color }} />
          <span className="text-lg font-bold text-foreground">{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

function VehicleTwin({ vehicle, delay }: { vehicle: Vehicle; delay: number }) {
  const isEV = vehicle.type.startsWith("ev");
  const isOnline = vehicle.status !== "offline";
  const energyPct = isEV ? (vehicle.battery ?? 0) : vehicle.fuel;
  const energyColor = energyPct > 60 ? "#10b981" : energyPct > 30 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`p-3 rounded-xl border transition-all ${
        isOnline
          ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
          : "border-white/5 bg-white/[0.01] opacity-50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`relative w-2 h-2 rounded-full ${
            vehicle.status === "active"
              ? "bg-emerald-500"
              : vehicle.status === "idle"
                ? "bg-amber-500"
                : vehicle.status === "maintenance"
                  ? "bg-orange-500"
                  : "bg-gray-600"
          }`}>
            {vehicle.status === "active" && (
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
            )}
          </div>
          <span className="text-xs font-semibold text-foreground">{vehicle.name}</span>
        </div>
        {isOnline ? (
          <Wifi className="w-3 h-3 text-emerald-400" />
        ) : (
          <WifiOff className="w-3 h-3 text-gray-600" />
        )}
      </div>

      {/* Mini gauges */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="text-center">
          <Gauge className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />
          <p className="text-[10px] font-semibold text-foreground">{vehicle.speed}</p>
          <p className="text-[8px] text-muted-foreground">km/h</p>
        </div>
        <div className="text-center">
          {isEV ? <Battery className="w-3 h-3 mx-auto mb-0.5 text-emerald-400" /> : <Fuel className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />}
          <p className="text-[10px] font-semibold" style={{ color: energyColor }}>{energyPct}%</p>
          <p className="text-[8px] text-muted-foreground">{isEV ? "batt" : "fuel"}</p>
        </div>
        <div className="text-center">
          <Activity className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />
          <p className="text-[10px] font-semibold text-foreground">{vehicle.utilization}%</p>
          <p className="text-[8px] text-muted-foreground">util</p>
        </div>
        <div className="text-center">
          <Leaf className="w-3 h-3 mx-auto mb-0.5 text-muted-foreground" />
          <p className="text-[10px] font-semibold" style={{ color: vehicle.emissions === 0 ? "#10b981" : "#f59e0b" }}>
            {vehicle.emissions}g
          </p>
          <p className="text-[8px] text-muted-foreground">CO₂</p>
        </div>
      </div>

      {/* Energy bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: energyColor }}
          initial={{ width: 0 }}
          animate={{ width: `${energyPct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function DigitalTwin() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = vehicles.filter((v) => v.status === "active").length;
  const evCount = vehicles.filter((v) => v.type.startsWith("ev")).length;
  const totalEmissions = vehicles.reduce((acc, v) => acc + v.emissions, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Digital Twin Fleet
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400">Synced</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Real-time fleet operational state mirror</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Fleet health gauges */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Fleet Health</h3>
          <div className="flex justify-around">
            <MetricGauge label="Active" value={activeCount} max={12} unit="vehicles" color="#10b981" icon={Truck} />
            <MetricGauge label="Green" value={evCount} max={12} unit="electric" color="#06b6d4" icon={Zap} />
            <MetricGauge label="Emissions" value={totalEmissions} max={1000} unit="g/km" color="#f59e0b" icon={Leaf} />
            <MetricGauge label="Uptime" value={Math.round((fleetStats.activeVehicles / fleetStats.totalVehicles) * 100)} max={100} unit="%" color="#a78bfa" icon={Shield} />
          </div>
        </div>

        {/* Live status summary */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Active", count: fleetStats.activeVehicles, color: "bg-emerald-500" },
            { label: "Idle", count: fleetStats.idleVehicles, color: "bg-amber-500" },
            { label: "Service", count: fleetStats.maintenanceVehicles, color: "bg-orange-500" },
            { label: "Offline", count: fleetStats.offlineVehicles, color: "bg-gray-500" },
          ].map((s) => (
            <div key={s.label} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className={`w-2 h-2 rounded-full ${s.color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-foreground">{s.count}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Vehicle twins grid */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Vehicle Twin Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {vehicles.map((v, i) => (
              <VehicleTwin key={v.id} vehicle={v} delay={i * 0.03} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
