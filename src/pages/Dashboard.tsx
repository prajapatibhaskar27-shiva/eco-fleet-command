"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import FleetMap from "@/components/fleet/FleetMap";
import VehicleList from "@/components/fleet/VehicleList";
import RouteOptimizer from "@/components/fleet/RouteOptimizer";
import Analytics from "@/components/fleet/Analytics";
import EcoPilot from "@/components/fleet/EcoPilot";
import ShipmentTracker from "@/components/fleet/ShipmentTracker";
import AlertsPanel from "@/components/fleet/AlertsPanel";
import DigitalTwin from "@/components/fleet/DigitalTwin";
import { vehicles, fleetStats, alerts } from "@/data/demo";
import type { Vehicle } from "@/data/demo";
import {
  Globe,
  Truck,
  Route,
  BarChart3,
  Sparkles,
  Package,
  Bell,
  Activity,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Zap,
  Fuel,
  Gauge,
  MapPin,
  Clock,
} from "lucide-react";

type View = "map" | "vehicles" | "routes" | "analytics" | "ecopilot" | "shipments" | "alerts" | "digital-twin";

const navItems: { key: View; label: string; icon: any }[] = [
  { key: "map", label: "Fleet Map", icon: Globe },
  { key: "vehicles", label: "Vehicles", icon: Truck },
  { key: "routes", label: "Routes", icon: Route },
  { key: "shipments", label: "Shipments", icon: Package },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "digital-twin", label: "Digital Twin", icon: Activity },
  { key: "ecopilot", label: "EcoPilot", icon: Sparkles },
];

function Sidebar({
  view,
  setView,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  view: View;
  setView: (v: View) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const unreadAlerts = alerts.filter((a) => !a.dismissed).length;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Leaf className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-foreground whitespace-nowrap">
            Smart Eco <span className="text-emerald-400">Fleet</span>
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setView(item.key);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.key === "alerts" && unreadAlerts > 0 && (
                <span className={`ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 font-medium ${collapsed ? "absolute top-1 right-1" : ""}`}>
                  {unreadAlerts}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className={`hidden lg:flex flex-col h-screen bg-[#0c1220] border-r border-white/5 transition-all relative ${
          collapsed ? "w-[68px]" : "w-[220px]"
        }`}
        animate={{ width: collapsed ? 68 : 220 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {navContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0c1220] border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0c1220] border-r border-white/5 z-50 lg:hidden flex flex-col"
            >
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function TopBar({ view, onMenuToggle }: { view: View; onMenuToggle: () => void }) {
  const viewTitles: Record<View, string> = {
    map: "Fleet Map",
    vehicles: "Vehicles",
    routes: "Route Optimizer",
    analytics: "Analytics",
    ecopilot: "EcoPilot",
    shipments: "Shipments",
    alerts: "AI Alerts",
    "digital-twin": "Digital Twin",
  };

  return (
    <div className="h-14 border-b border-white/5 bg-[#0a1120]/80 backdrop-blur-xl flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-foreground">{viewTitles[view]}</h1>
      </div>

      {/* Quick stats */}
      <div className="hidden sm:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          {fleetStats.activeVehicles} active
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Package className="w-3 h-3" />
          {fleetStats.totalDeliveriesToday} deliveries
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Leaf className="w-3 h-3" />
          {fleetStats.co2Saved} kg CO₂ saved
        </div>
      </div>
    </div>
  );
}

function MapView({ selectedVehicleId, onSelectVehicle }: { selectedVehicleId: string | null; onSelectVehicle: (v: Vehicle | null) => void }) {
  return (
    <div className="h-full flex flex-col lg:flex-row gap-0">
      <div className="flex-1 p-2 sm:p-4">
        <FleetMap onSelectVehicle={(v) => onSelectVehicle(v)} selectedVehicleId={selectedVehicleId} />
      </div>
      <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a1120]/50 overflow-hidden">
        <VehicleList onSelectVehicle={(v) => onSelectVehicle(v)} selectedVehicleId={selectedVehicleId} />
      </div>
    </div>
  );
}

function VehicleDetailPanel({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const isEV = vehicle.type.startsWith("ev");
  const energyPct = isEV ? (vehicle.battery ?? 0) : vehicle.fuel;
  const loadPct = (vehicle.load / vehicle.maxLoad) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-0 top-0 bottom-0 w-[320px] bg-[#0c1220] border-l border-white/5 z-20 flex flex-col"
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{vehicle.name}</h3>
        <button onClick={onClose} className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEV ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
            {isEV ? <Zap className="w-5 h-5 text-emerald-400" /> : <Truck className="w-5 h-5 text-amber-400" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{vehicle.driver}</p>
            <p className="text-xs text-muted-foreground">{vehicle.route}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{isEV ? "Battery" : "Fuel"}</span>
              <span className="text-foreground font-medium">{energyPct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${energyPct > 60 ? "bg-emerald-500" : energyPct > 30 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${energyPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Load</span>
              <span className="text-foreground font-medium">{vehicle.load.toLocaleString()} / {vehicle.maxLoad.toLocaleString()} kg</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${loadPct}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Speed", value: `${vehicle.speed} km/h`, icon: Gauge },
            { label: "CO₂", value: `${vehicle.emissions} g/km`, icon: Leaf },
            { label: "Utilization", value: `${vehicle.utilization}%`, icon: Activity },
            { label: "ETA", value: vehicle.eta, icon: Clock },
          ].map((item) => (
            <div key={item.label} className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <item.icon className="w-3 h-3 text-muted-foreground mb-1" />
              <p className="text-xs font-semibold text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Destination</span>
            <span className="text-foreground font-medium">{vehicle.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Distance</span>
            <span className="text-foreground font-medium">{vehicle.totalKm.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Maintenance</span>
            <span className="text-foreground font-medium">{vehicle.lastMaintenance}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<View>("map");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedVehicle = selectedVehicleId ? vehicles.find((v) => v.id === selectedVehicleId) ?? null : null;

  const renderView = () => {
    switch (view) {
      case "map":
        return <MapView selectedVehicleId={selectedVehicleId} onSelectVehicle={(v) => setSelectedVehicleId(v?.id ?? null)} />;
      case "vehicles":
        return (
          <div className="h-full overflow-hidden">
            <VehicleList onSelectVehicle={(v) => setSelectedVehicleId(v?.id ?? null)} selectedVehicleId={selectedVehicleId} />
          </div>
        );
      case "routes":
        return <RouteOptimizer />;
      case "analytics":
        return <Analytics />;
      case "ecopilot":
        return <EcoPilot />;
      case "shipments":
        return <ShipmentTracker />;
      case "alerts":
        return <AlertsPanel />;
      case "digital-twin":
        return <DigitalTwin />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-[#0a1120] text-foreground overflow-hidden">
      <Sidebar
        view={view}
        setView={setView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar view={view} onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>

          {/* Vehicle detail overlay */}
          <AnimatePresence>
            {selectedVehicle && view === "map" && (
              <VehicleDetailPanel
                vehicle={selectedVehicle}
                onClose={() => setSelectedVehicleId(null)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
