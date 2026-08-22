"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import ShipmentMap from "@/components/fleet/FleetMap";
import BookingList from "@/components/fleet/VehicleList";
import Catalog from "@/components/fleet/RouteOptimizer";
import DashboardOverview from "@/components/fleet/Analytics";
import BookingDetail from "@/components/fleet/DigitalTwin";
import EcoPilot from "@/components/fleet/EcoPilot";
import ShipmentHistory from "@/components/fleet/ShipmentTracker";
import Notifications from "@/components/fleet/AlertsPanel";
import Schedule from "@/components/fleet/Schedule";
import Checkout from "@/components/fleet/Checkout";
import ActiveShipments from "@/components/ActiveShipments";
import DisruptionAwareShipments from "@/components/ActiveShipmentsWrapper";
import { Plus } from "lucide-react";
import { customerStats, notifications as demoNotifications } from "@/data/demo";
import { DisruptionProvider, useDisruption } from "@/contexts/DisruptionContext";
import type { DisruptionZone } from "@/data/demo";
import type { Booking, CatalogItem } from "@/data/demo";
import {
  Globe, Package, Search, BarChart3, Sparkles, Clock, Bell, Calendar,
  LogOut, Leaf, ChevronLeft, ChevronRight, Menu, X, Ship, AlertTriangle,
} from "lucide-react";

type View = "dashboard" | "bookings" | "detail" | "catalog" | "schedule" | "checkout" | "history" | "notifications" | "ecopilot" | "map" | "shipments";

const navItems: { key: View; label: string; icon: any }[] = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "bookings", label: "My Bookings", icon: Package },
  { key: "catalog", label: "Catalog", icon: Search },
  { key: "schedule", label: "New Booking", icon: Calendar },
  { key: "map", label: "Tracking Map", icon: Globe },
  { key: "shipments", label: "Shipments", icon: Ship },
  { key: "history", label: "History", icon: Clock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "ecopilot", label: "EcoPilot", icon: Sparkles },
];

/* ── Sidebar ────────────────────────────────────────────────────────────── */
function Sidebar({
  view, setView, collapsed, setCollapsed, mobileOpen, setMobileOpen,
}: {
  view: View; setView: (v: View) => void; collapsed: boolean;
  setCollapsed: (v: boolean) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const unreadCount = demoNotifications.filter((n) => !n.read).length;

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const navContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 h-16 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <Leaf className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-bold text-white tracking-tight whitespace-nowrap">
            Eco Fleet <span className="text-emerald-400">Command</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setView(item.key); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.key === "notifications" && unreadCount > 0 && (
                <span className={`ml-auto min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ${collapsed ? "absolute top-1 right-1 ml-0" : ""}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className={`hidden lg:flex flex-col h-screen bg-[#0f1729] dark:bg-[#0a0f1a] transition-all relative shrink-0 ${collapsed ? "w-[68px]" : "w-[232px]"}`}
        animate={{ width: collapsed ? 68 : 232 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {navContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-300 transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 w-[232px] bg-[#0f1729] dark:bg-[#0a0f1a] z-50 lg:hidden flex flex-col">
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Top Bar ────────────────────────────────────────────────────────────── */
function TopBar({ view, setView, onMenuToggle }: { view: View; setView: (v: View) => void; onMenuToggle: () => void }) {
  const { theme, toggle } = useTheme();
  const titles: Record<View, string> = {
    dashboard: "Dashboard", bookings: "My Bookings", detail: "Booking Details",
    catalog: "Service Catalog", schedule: "New Booking", checkout: "Checkout",
    history: "Shipment History", notifications: "Notifications", ecopilot: "EcoPilot",
    map: "Tracking Map", shipments: "Energy Shipments",
  };

  return (
    <div className="h-16 border-b border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#111827] flex items-center justify-between px-4 sm:px-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">{titles[view]}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-4 sm:gap-5 text-[13px]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{customerStats.activeShipments} active</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Package className="w-3.5 h-3.5" />
            {customerStats.totalBookings} bookings
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            {customerStats.co2Saved} kg saved
          </div>
        </div>

        {/* ── Theme Toggle ────────────────────────────────────────── */}
        <button
          onClick={toggle}
          className="relative w-[68px] h-[34px] rounded-full border border-gray-200 dark:border-white/[0.12] bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all duration-300 flex items-center px-1 group"
          aria-label={`Switch to ${theme === "dark" ? "bright" : "dark"} mode`}
        >
          <motion.div
            className="w-[26px] h-[26px] rounded-full bg-white dark:bg-emerald-500 shadow-md flex items-center justify-center text-[14px]"
            animate={{ x: theme === "dark" ? 34 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </motion.div>
        </button>

        <button
          onClick={() => setView("schedule")}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold hover:bg-emerald-600 active:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>
    </div>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────────────── */
function DashboardInner() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    serviceName: string; origin: string; destination: string;
    weight: string; items: string; estimatedCost: number; estimatedCo2: number;
  } | null>(null);

  const handleBookService = (item: CatalogItem) => { setPreselectedServiceId(item.id); setView("schedule"); };
  const handleScheduleComplete = (data?: { serviceName: string; origin: string; destination: string; weight: string; items: string; estimatedCost: number; estimatedCo2: number }) => {
    setCheckoutData(data || { serviceName: "Eco Express", origin: "San Francisco, CA", destination: "Portland, OR", weight: "5", items: "1", estimatedCost: 26.00, estimatedCo2: 0.75 });
    setView("checkout");
  };
  const handleCheckoutComplete = () => { setCheckoutData(null); setPreselectedServiceId(null); setView("bookings"); };
  const handleBookingSelect = (b: Booking) => { setSelectedBookingId(b.id); setView("detail"); };

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardOverview />;
      case "map": return (
        <div className="h-full flex flex-col lg:flex-row gap-0">
          <div className="flex-1 p-3 sm:p-5"><ShipmentMap onSelectBooking={handleBookingSelect} selectedBookingId={selectedBookingId} /></div>
          <div className="w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-gray-200 overflow-hidden">
            <BookingList onSelectBooking={handleBookingSelect} selectedBookingId={selectedBookingId} />
          </div>
        </div>
      );
      case "bookings": return <BookingList onSelectBooking={handleBookingSelect} selectedBookingId={selectedBookingId} />;
      case "detail": return selectedBookingId ? <BookingDetail bookingId={selectedBookingId} onBack={() => setView("bookings")} /> : <div className="p-6 text-sm text-gray-500">Select a booking to view details.</div>;
      case "catalog": return <Catalog onBookService={handleBookService} />;
      case "schedule": return <Schedule preselectedServiceId={preselectedServiceId} onComplete={handleScheduleComplete} />;
      case "checkout": return checkoutData ? <Checkout {...checkoutData} onComplete={handleCheckoutComplete} /> : <div className="p-6 text-sm text-gray-500">No checkout in progress.</div>;
      case "history": return <ShipmentHistory />;
      case "notifications": return <Notifications />;
      case "ecopilot": return <EcoPilot />;
      case "shipments": return <DisruptionAwareShipments />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-[#111827] text-foreground overflow-hidden transition-colors duration-300">
      <Sidebar view={view} setView={setView} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar view={view} setView={setView} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="h-full">
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DisruptionProvider>
      <DashboardInner />
    </DisruptionProvider>
  );
}
