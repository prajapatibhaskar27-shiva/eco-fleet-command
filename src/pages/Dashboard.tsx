"use client";

import { useState } from "react";
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
import { bookings, customerStats, notifications as demoNotifications } from "@/data/demo";
import type { Booking, CatalogItem } from "@/data/demo";
import {
  Globe,
  Package,
  Search,
  BarChart3,
  Sparkles,
  Clock,
  Bell,
  Calendar,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MapPin,
  DollarSign,
} from "lucide-react";

type View = "dashboard" | "bookings" | "detail" | "catalog" | "schedule" | "checkout" | "history" | "notifications" | "ecopilot" | "map";

const navItems: { key: View; label: string; icon: any; badge?: number }[] = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "bookings", label: "My Bookings", icon: Package },
  { key: "catalog", label: "Catalog", icon: Search },
  { key: "schedule", label: "New Booking", icon: Calendar },
  { key: "map", label: "Tracking Map", icon: Globe },
  { key: "history", label: "History", icon: Clock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "ecopilot", label: "EcoPilot", icon: Sparkles },
];

function Sidebar({
  view, setView, collapsed, setCollapsed, mobileOpen, setMobileOpen,
}: {
  view: View; setView: (v: View) => void; collapsed: boolean; setCollapsed: (v: boolean) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const unreadCount = demoNotifications.filter((n) => !n.read).length;

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const navContent = (
    <>
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Leaf className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && <span className="text-sm font-bold text-foreground whitespace-nowrap tracking-tight">Eco Fleet <span className="text-emerald-400">Command</span></span>}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setView(item.key); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.key === "notifications" && unreadCount > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 font-medium ${collapsed ? "absolute top-1 right-1" : "ml-auto"}`}>{unreadCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5 space-y-1">
        <button onClick={handleSignOut} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all ${collapsed ? "justify-center" : ""}`} title={collapsed ? "Sign Out" : undefined}>
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <motion.aside className={`hidden lg:flex flex-col h-screen bg-[#0c1220] border-r border-white/5 transition-all relative ${collapsed ? "w-[68px]" : "w-[220px]"}`} animate={{ width: collapsed ? 68 : 220 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
        {navContent}
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0c1220] border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all z-10">
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0c1220] border-r border-white/5 z-50 lg:hidden flex flex-col">
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function TopBar({ view, onMenuToggle }: { view: View; onMenuToggle: () => void }) {
  const titles: Record<View, string> = {
    dashboard: "Dashboard", bookings: "My Bookings", detail: "Booking Details", catalog: "Service Catalog",
    schedule: "New Booking", checkout: "Checkout", history: "Shipment History", notifications: "Notifications",
    ecopilot: "EcoPilot", map: "Tracking Map",
  };

  return (
    <div className="h-14 border-b border-white/5 bg-[#0a1120]/80 backdrop-blur-xl flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-foreground">{titles[view]}</h1>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
          {customerStats.activeShipments} active
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><Package className="w-3 h-3" />{customerStats.totalBookings} bookings</div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><Leaf className="w-3 h-3" />{customerStats.co2Saved} kg saved</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Schedule state
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  // Checkout state
  const [checkoutData, setCheckoutData] = useState<{
    serviceName: string; origin: string; destination: string; weight: string; items: string;
    estimatedCost: number; estimatedCo2: number;
  } | null>(null);

  const handleBookService = (item: CatalogItem) => {
    setPreselectedServiceId(item.id);
    setView("schedule");
  };

  const handleScheduleComplete = () => {
    // Simulate going to checkout with sample data
    setCheckoutData({
      serviceName: "Eco Express", origin: "San Francisco, CA", destination: "Portland, OR",
      weight: "5", items: "1", estimatedCost: 26.00, estimatedCo2: 0.75,
    });
    setView("checkout");
  };

  const handleCheckoutComplete = () => {
    setCheckoutData(null);
    setPreselectedServiceId(null);
    setView("bookings");
  };

  const handleBookingSelect = (b: Booking) => {
    setSelectedBookingId(b.id);
    setView("detail");
  };

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardOverview />;
      case "map":
        return (
          <div className="h-full flex flex-col lg:flex-row gap-0">
            <div className="flex-1 p-2 sm:p-4"><ShipmentMap onSelectBooking={handleBookingSelect} selectedBookingId={selectedBookingId} /></div>
            <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a1120]/50 overflow-hidden">
              <BookingList onSelectBooking={handleBookingSelect} selectedBookingId={selectedBookingId} />
            </div>
          </div>
        );
      case "bookings": return <BookingList onSelectBooking={handleBookingSelect} selectedBookingId={selectedBookingId} />;
      case "detail":
        return selectedBookingId ? (
          <BookingDetail bookingId={selectedBookingId} onBack={() => setView("bookings")} />
        ) : <div className="p-6 text-sm text-muted-foreground">Select a booking to view details.</div>;
      case "catalog": return <Catalog onBookService={handleBookService} />;
      case "schedule": return <Schedule preselectedServiceId={preselectedServiceId} onComplete={handleScheduleComplete} />;
      case "checkout":
        return checkoutData ? (
          <Checkout {...checkoutData} onComplete={handleCheckoutComplete} />
        ) : <div className="p-6 text-sm text-muted-foreground">No checkout in progress.</div>;
      case "history": return <ShipmentHistory />;
      case "notifications": return <Notifications />;
      case "ecopilot": return <EcoPilot />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex bg-[#0a1120] text-foreground overflow-hidden">
      <Sidebar view={view} setView={setView} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar view={view} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="h-full">
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
