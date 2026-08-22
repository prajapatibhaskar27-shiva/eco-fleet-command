// ── Types ────────────────────────────────────────────────────────────────
export type VehicleStatus = "active" | "idle" | "maintenance" | "offline";
export type VehicleType = "truck" | "van" | "ev-truck" | "ev-van";

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  lat: number;
  lng: number;
  speed: number;
  fuel: number;
  battery?: number;
  utilization: number;
  emissions: number;
  driver: string;
  route: string;
  destination: string;
  eta: string;
  load: number;
  maxLoad: number;
  lastMaintenance: string;
  totalKm: number;
}

export interface Route {
  id: string;
  name: string;
  vehicles: string[];
  distance: number;
  duration: string;
  fuelSaved: number;
  co2Saved: number;
  status: "optimal" | "suboptimal" | "warning";
  waypoints: { lat: number; lng: number; label: string }[];
  greenScore: number;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: "pending" | "in-transit" | "delivered" | "delayed";
  vehicleId: string;
  progress: number;
  eta: string;
  items: number;
  weight: number;
  timeline: { time: string; event: string; status: "done" | "current" | "pending" }[];
}

export interface FleetAlert {
  id: string;
  type: "delay" | "route" | "idle" | "maintenance" | "eco";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  vehicleId?: string;
  timestamp: string;
  dismissed: boolean;
}

export interface DailyMetric {
  day: string;
  value: number;
}

export interface MonthlyMetric {
  month: string;
  value: number;
}

// ── Base coordinates (centered around a metro area) ──────────────────────
const C = { lat: 40.7128, lng: -74.006 };

function off(latO: number, lngO: number) {
  return { lat: C.lat + latO, lng: C.lng + lngO };
}

// ── Vehicles ─────────────────────────────────────────────────────────────
export const vehicles: Vehicle[] = [
  {
    id: "v1",
    name: "EcoTruck Alpha",
    type: "ev-truck",
    status: "active",
    ...off(0.045, 0.032),
    speed: 42,
    fuel: 0,
    battery: 78,
    utilization: 87,
    emissions: 0,
    driver: "Marcus Chen",
    route: "Downtown Express",
    destination: "Brooklyn Depot",
    eta: "14 min",
    load: 4200,
    maxLoad: 5000,
    lastMaintenance: "2026-08-15",
    totalKm: 23400,
  },
  {
    id: "v2",
    name: "EcoTruck Beta",
    type: "truck",
    status: "active",
    ...off(0.02, -0.04),
    speed: 58,
    fuel: 62,
    utilization: 74,
    emissions: 142,
    driver: "Sarah Kim",
    route: "Highway 9 Corridor",
    destination: "Newark Hub",
    eta: "28 min",
    load: 3800,
    maxLoad: 5000,
    lastMaintenance: "2026-08-10",
    totalKm: 45200,
  },
  {
    id: "v3",
    name: "GreenVan One",
    type: "ev-van",
    status: "active",
    ...off(-0.03, 0.05),
    speed: 31,
    fuel: 0,
    battery: 54,
    utilization: 92,
    emissions: 0,
    driver: "James Wright",
    route: "Suburban Loop",
    destination: "Hoboken Center",
    eta: "22 min",
    load: 1800,
    maxLoad: 2000,
    lastMaintenance: "2026-08-18",
    totalKm: 18700,
  },
  {
    id: "v4",
    name: "GreenVan Two",
    type: "van",
    status: "idle",
    ...off(-0.01, -0.02),
    speed: 0,
    fuel: 45,
    utilization: 0,
    emissions: 0,
    driver: "Lisa Park",
    route: "—",
    destination: "Depot A",
    eta: "—",
    load: 0,
    maxLoad: 2000,
    lastMaintenance: "2026-08-20",
    totalKm: 31500,
  },
  {
    id: "v5",
    name: "EcoTruck Gamma",
    type: "ev-truck",
    status: "maintenance",
    ...off(0.01, -0.06),
    speed: 0,
    fuel: 0,
    battery: 12,
    utilization: 0,
    emissions: 0,
    driver: "—",
    route: "—",
    destination: "Service Center",
    eta: "—",
    load: 0,
    maxLoad: 5000,
    lastMaintenance: "2026-08-22",
    totalKm: 67800,
  },
  {
    id: "v6",
    name: "GreenVan Three",
    type: "van",
    status: "active",
    ...off(0.06, -0.01),
    speed: 25,
    fuel: 38,
    utilization: 65,
    emissions: 98,
    driver: "David Nguyen",
    route: "City Center Route",
    destination: "Midtown Warehouse",
    eta: "9 min",
    load: 1300,
    maxLoad: 2000,
    lastMaintenance: "2026-08-12",
    totalKm: 28900,
  },
  {
    id: "v7",
    name: "EcoTruck Delta",
    type: "truck",
    status: "active",
    ...off(-0.05, -0.03),
    speed: 65,
    fuel: 51,
    utilization: 81,
    emissions: 156,
    driver: "Anna Torres",
    route: "Industrial Corridor",
    destination: "Port Newark",
    eta: "35 min",
    load: 4500,
    maxLoad: 5000,
    lastMaintenance: "2026-08-17",
    totalKm: 52100,
  },
  {
    id: "v8",
    name: "GreenVan Four",
    type: "ev-van",
    status: "active",
    ...off(0.08, 0.04),
    speed: 38,
    fuel: 0,
    battery: 42,
    utilization: 78,
    emissions: 0,
    driver: "Carlos Rivera",
    route: "Airport Express",
    destination: "JFK Cargo Terminal",
    eta: "18 min",
    load: 1560,
    maxLoad: 2000,
    lastMaintenance: "2026-08-19",
    totalKm: 14200,
  },
  {
    id: "v9",
    name: "EcoTruck Epsilon",
    type: "truck",
    status: "offline",
    ...off(-0.07, 0.02),
    speed: 0,
    fuel: 15,
    utilization: 0,
    emissions: 0,
    driver: "—",
    route: "—",
    destination: "—",
    eta: "—",
    load: 0,
    maxLoad: 5000,
    lastMaintenance: "2026-07-28",
    totalKm: 89400,
  },
  {
    id: "v10",
    name: "GreenVan Five",
    type: "ev-van",
    status: "active",
    ...off(-0.02, 0.07),
    speed: 22,
    fuel: 0,
    battery: 67,
    utilization: 58,
    emissions: 0,
    driver: "Priya Sharma",
    route: "Residential Circuit",
    destination: "Jersey City Hub",
    eta: "26 min",
    load: 1160,
    maxLoad: 2000,
    lastMaintenance: "2026-08-21",
    totalKm: 9800,
  },
  {
    id: "v11",
    name: "EcoTruck Zeta",
    type: "ev-truck",
    status: "active",
    ...off(0.035, -0.055),
    speed: 47,
    fuel: 0,
    battery: 89,
    utilization: 95,
    emissions: 0,
    driver: "Tom Bradley",
    route: "North Express",
    destination: "Bronx Distribution",
    eta: "31 min",
    load: 4750,
    maxLoad: 5000,
    lastMaintenance: "2026-08-20",
    totalKm: 11200,
  },
  {
    id: "v12",
    name: "GreenVan Six",
    type: "van",
    status: "active",
    ...off(0.01, 0.045),
    speed: 33,
    fuel: 41,
    utilization: 71,
    emissions: 87,
    driver: "Emily Watson",
    route: "Harbor Loop",
    destination: "Staten Island Depot",
    eta: "19 min",
    load: 1420,
    maxLoad: 2000,
    lastMaintenance: "2026-08-16",
    totalKm: 34600,
  },
];

// ── Routes ───────────────────────────────────────────────────────────────
export const routes: Route[] = [
  {
    id: "r1",
    name: "Downtown Express → Brooklyn Depot",
    vehicles: ["v1"],
    distance: 12.4,
    duration: "14 min",
    fuelSaved: 23,
    co2Saved: 4.8,
    status: "optimal",
    greenScore: 94,
    waypoints: [
      { ...off(0.045, 0.032), label: "Start" },
      { ...off(0.03, 0.01), label: "Hub A" },
      { ...off(0.01, -0.01), label: "Transfer" },
      { ...off(-0.01, -0.03), label: "Brooklyn Depot" },
    ],
  },
  {
    id: "r2",
    name: "Highway 9 → Newark Hub",
    vehicles: ["v2"],
    distance: 24.1,
    duration: "28 min",
    fuelSaved: 12,
    co2Saved: 2.1,
    status: "suboptimal",
    greenScore: 67,
    waypoints: [
      { ...off(0.02, -0.04), label: "Start" },
      { ...off(0.0, -0.08), label: "Highway Junction" },
      { ...off(-0.03, -0.12), label: "Newark Hub" },
    ],
  },
  {
    id: "r3",
    name: "Suburban Loop → Hoboken",
    vehicles: ["v3"],
    distance: 8.7,
    duration: "22 min",
    fuelSaved: 31,
    co2Saved: 5.2,
    status: "optimal",
    greenScore: 91,
    waypoints: [
      { ...off(-0.03, 0.05), label: "Start" },
      { ...off(-0.01, 0.03), label: "Residential" },
      { ...off(0.01, 0.01), label: "Hoboken Center" },
    ],
  },
  {
    id: "r4",
    name: "Airport Express → JFK",
    vehicles: ["v8"],
    distance: 18.9,
    duration: "18 min",
    fuelSaved: 28,
    co2Saved: 6.1,
    status: "optimal",
    greenScore: 88,
    waypoints: [
      { ...off(0.08, 0.04), label: "Start" },
      { ...off(0.1, 0.06), label: "Terminal Access" },
      { ...off(0.12, 0.09), label: "JFK Cargo" },
    ],
  },
  {
    id: "r5",
    name: "Industrial → Port Newark",
    vehicles: ["v7"],
    distance: 31.2,
    duration: "35 min",
    fuelSaved: 8,
    co2Saved: 1.3,
    status: "warning",
    greenScore: 45,
    waypoints: [
      { ...off(-0.05, -0.03), label: "Start" },
      { ...off(-0.08, -0.06), label: "Industrial Zone" },
      { ...off(-0.11, -0.09), label: "Port Newark" },
    ],
  },
  {
    id: "r6",
    name: "North Express → Bronx",
    vehicles: ["v11"],
    distance: 15.3,
    duration: "31 min",
    fuelSaved: 26,
    co2Saved: 5.5,
    status: "optimal",
    greenScore: 90,
    waypoints: [
      { ...off(0.035, -0.055), label: "Start" },
      { ...off(0.06, -0.03), label: "Uptown" },
      { ...off(0.09, -0.01), label: "Bronx Dist." },
    ],
  },
];

// ── Shipments ────────────────────────────────────────────────────────────
export const shipments: Shipment[] = [
  {
    id: "s1",
    origin: "Manhattan Hub",
    destination: "Brooklyn Depot",
    status: "in-transit",
    vehicleId: "v1",
    progress: 72,
    eta: "14 min",
    items: 34,
    weight: 4200,
    timeline: [
      { time: "08:00", event: "Order received", status: "done" },
      { time: "08:15", event: "Loaded at Manhattan Hub", status: "done" },
      { time: "08:22", event: "Departed — Downtown Express", status: "done" },
      { time: "08:38", event: "Passing Hub A transfer point", status: "current" },
      { time: "08:52", event: "Arrive Brooklyn Depot", status: "pending" },
    ],
  },
  {
    id: "s2",
    origin: "Queens Warehouse",
    destination: "Newark Hub",
    status: "in-transit",
    vehicleId: "v2",
    progress: 48,
    eta: "28 min",
    items: 52,
    weight: 3800,
    timeline: [
      { time: "07:45", event: "Order received", status: "done" },
      { time: "08:00", event: "Loaded at Queens Warehouse", status: "done" },
      { time: "08:08", event: "On Highway 9", status: "current" },
      { time: "08:25", event: "Highway junction", status: "pending" },
      { time: "08:38", event: "Arrive Newark Hub", status: "pending" },
    ],
  },
  {
    id: "s3",
    origin: "Depot A",
    destination: "Hoboken Center",
    status: "in-transit",
    vehicleId: "v3",
    progress: 65,
    eta: "22 min",
    items: 18,
    weight: 1800,
    timeline: [
      { time: "08:10", event: "Order received", status: "done" },
      { time: "08:20", event: "Loaded at Depot A", status: "done" },
      { time: "08:28", event: "Suburban Loop started", status: "done" },
      { time: "08:40", event: "Residential area", status: "current" },
      { time: "08:50", event: "Arrive Hoboken Center", status: "pending" },
    ],
  },
  {
    id: "s4",
    origin: "Midtown Hub",
    destination: "JFK Cargo Terminal",
    status: "in-transit",
    vehicleId: "v8",
    progress: 35,
    eta: "18 min",
    items: 22,
    weight: 1560,
    timeline: [
      { time: "08:15", event: "Order received", status: "done" },
      { time: "08:25", event: "Loaded at Midtown Hub", status: "done" },
      { time: "08:32", event: "Airport Express started", status: "current" },
      { time: "08:42", event: "Terminal access road", status: "pending" },
      { time: "08:50", event: "Arrive JFK Cargo", status: "pending" },
    ],
  },
  {
    id: "s5",
    origin: "Manhattan Center",
    destination: "Midtown Warehouse",
    status: "delivered",
    vehicleId: "v6",
    progress: 100,
    eta: "Delivered",
    items: 28,
    weight: 1300,
    timeline: [
      { time: "07:00", event: "Order received", status: "done" },
      { time: "07:15", event: "Loaded", status: "done" },
      { time: "07:20", event: "Departed", status: "done" },
      { time: "07:38", event: "Arrived", status: "done" },
      { time: "07:42", event: "Delivered & confirmed", status: "done" },
    ],
  },
  {
    id: "s6",
    origin: "Bronx Hub",
    destination: "Residential Area",
    status: "delayed",
    vehicleId: "v10",
    progress: 22,
    eta: "45 min (delayed)",
    items: 14,
    weight: 1160,
    timeline: [
      { time: "07:30", event: "Order received", status: "done" },
      { time: "07:45", event: "Loaded at Bronx Hub", status: "done" },
      { time: "08:00", event: "Departed — traffic delay", status: "current" },
      { time: "08:30", event: "Resume route", status: "pending" },
      { time: "08:55", event: "Arrive destination", status: "pending" },
    ],
  },
  {
    id: "s7",
    origin: "Newark Warehouse",
    destination: "Manhattan Hub",
    status: "pending",
    vehicleId: "v4",
    progress: 0,
    eta: "55 min",
    items: 41,
    weight: 1900,
    timeline: [
      { time: "09:00", event: "Scheduled pickup", status: "pending" },
      { time: "09:15", event: "Load vehicle", status: "pending" },
      { time: "09:30", event: "Depart Newark", status: "pending" },
      { time: "09:50", event: "Highway transit", status: "pending" },
      { time: "10:05", event: "Arrive Manhattan Hub", status: "pending" },
    ],
  },
  {
    id: "s8",
    origin: "Staten Island Depot",
    destination: "Bayonne Center",
    status: "in-transit",
    vehicleId: "v12",
    progress: 58,
    eta: "12 min",
    items: 19,
    weight: 1420,
    timeline: [
      { time: "08:05", event: "Order received", status: "done" },
      { time: "08:12", event: "Loaded at depot", status: "done" },
      { time: "08:18", event: "Harbor Loop started", status: "done" },
      { time: "08:28", event: "Crossing harbor bridge", status: "current" },
      { time: "08:35", event: "Arrive Bayonne Center", status: "pending" },
    ],
  },
];

// ── Alerts ───────────────────────────────────────────────────────────────
export const alerts: FleetAlert[] = [
  {
    id: "a1",
    type: "delay",
    severity: "high",
    title: "Traffic congestion on Highway 9",
    description:
      "GreenVan Five experiencing 12 min delay due to accident on I-95. Suggested alternate via local roads saves 8 min.",
    vehicleId: "v10",
    timestamp: "08:24",
    dismissed: false,
  },
  {
    id: "a2",
    type: "route",
    severity: "medium",
    title: "Suboptimal route detected",
    description:
      "EcoTruck Beta can save 14% fuel by switching to Route 21C. Green score improves from 67 → 82.",
    vehicleId: "v2",
    timestamp: "08:20",
    dismissed: false,
  },
  {
    id: "a3",
    type: "idle",
    severity: "low",
    title: "Vehicle idle for 45 minutes",
    description:
      "GreenVan Two has been idle at Depot A since 07:39. Consider reassigning to pending shipment s7.",
    vehicleId: "v4",
    timestamp: "08:24",
    dismissed: false,
  },
  {
    id: "a4",
    type: "maintenance",
    severity: "high",
    title: "Battery critical — EcoTruck Gamma",
    description:
      "Battery at 12%. Vehicle requires charging before next dispatch. Service bay 3 reserved.",
    vehicleId: "v5",
    timestamp: "08:15",
    dismissed: false,
  },
  {
    id: "a5",
    type: "eco",
    severity: "medium",
    title: "Fleet eco score dropped below target",
    description:
      "Overall fleet green score is 78.4 (target: 82). Two ICE vehicles running suboptimal routes. Switching would recover 3.2 points.",
    timestamp: "08:10",
    dismissed: false,
  },
  {
    id: "a6",
    type: "maintenance",
    severity: "medium",
    title: "Service overdue — EcoTruck Epsilon",
    description:
      "Last maintenance was 25 days ago (threshold: 21 days). Vehicle offline — schedule service before reactivation.",
    vehicleId: "v9",
    timestamp: "07:45",
    dismissed: false,
  },
  {
    id: "a7",
    type: "route",
    severity: "low",
    title: "Green route opportunity",
    description:
      "EcoTruck Delta can reduce CO₂ by 18% taking the Port via Local instead of Industrial Express. Adds 4 min.",
    vehicleId: "v7",
    timestamp: "07:30",
    dismissed: false,
  },
];

// ── Analytics ────────────────────────────────────────────────────────────
export const fuelUsage: DailyMetric[] = [
  { day: "Mon", value: 320 },
  { day: "Tue", value: 290 },
  { day: "Wed", value: 310 },
  { day: "Thu", value: 275 },
  { day: "Fri", value: 260 },
  { day: "Sat", value: 180 },
  { day: "Sun", value: 140 },
];

export const co2Reduction: MonthlyMetric[] = [
  { month: "Mar", value: 12.4 },
  { month: "Apr", value: 15.8 },
  { month: "May", value: 18.2 },
  { month: "Jun", value: 21.5 },
  { month: "Jul", value: 24.1 },
  { month: "Aug", value: 27.3 },
];

export const deliveryEfficiency: DailyMetric[] = [
  { day: "Mon", value: 94 },
  { day: "Tue", value: 91 },
  { day: "Wed", value: 96 },
  { day: "Thu", value: 93 },
  { day: "Fri", value: 89 },
  { day: "Sat", value: 97 },
  { day: "Sun", value: 95 },
];

export const fleetUtilization: DailyMetric[] = [
  { day: "Mon", value: 78 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 75 },
  { day: "Thu", value: 85 },
  { day: "Fri", value: 88 },
  { day: "Sat", value: 62 },
  { day: "Sun", value: 54 },
];

export const hourlyThroughput = [
  { hour: "6 AM", deliveries: 4, pickups: 2 },
  { hour: "7 AM", deliveries: 8, pickups: 5 },
  { hour: "8 AM", deliveries: 14, pickups: 9 },
  { hour: "9 AM", deliveries: 18, pickups: 12 },
  { hour: "10 AM", deliveries: 22, pickups: 15 },
  { hour: "11 AM", deliveries: 20, pickups: 14 },
  { hour: "12 PM", deliveries: 16, pickups: 10 },
  { hour: "1 PM", deliveries: 19, pickups: 13 },
  { hour: "2 PM", deliveries: 24, pickups: 16 },
  { hour: "3 PM", deliveries: 21, pickups: 14 },
  { hour: "4 PM", deliveries: 17, pickups: 11 },
  { hour: "5 PM", deliveries: 12, pickups: 7 },
];

// ── Fleet summary stats ─────────────────────────────────────────────────
export const fleetStats = {
  totalVehicles: 12,
  activeVehicles: 8,
  idleVehicles: 1,
  maintenanceVehicles: 1,
  offlineVehicles: 2,
  totalDeliveriesToday: 47,
  onTimeRate: 94.2,
  totalDistance: 186.3,
  fuelSaved: 23.4,
  co2Saved: 27.3,
  avgUtilization: 78.4,
  avgGreenScore: 82.1,
};
