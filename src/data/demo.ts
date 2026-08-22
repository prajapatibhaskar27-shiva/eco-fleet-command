// ── Energy Logistics Types ──────────────────────────────────────────────
export type VesselClass = "VLCC" | "Suezmax" | "Aframax" | "Panamax" | "Handysize";
export type CrudeType = "Arabian Light" | "Arabian Heavy" | "Basrah Medium" | "Basrah Heavy" | "Bonny Light" | "Forcados" | "Iran Heavy" | "Dubai" | "Mars" | "Oman";
export type ShipmentStatus = "in-transit" | "rerouted" | "docked";
export type DisruptionZone = "NONE" | "HORMUZ" | "RED_SEA";

export interface EnergyShipment {
  id: string;
  vesselName: string;
  vesselClass: VesselClass;
  imo: string;
  origin: string;
  destination: string;
  crudeType: CrudeType;
  payload: string;
  payloadBarrels: number;
  status: ShipmentStatus;
  disruption: DisruptionZone;
  etaDays: number;
  etaOriginalDays: number;
  speed: number;
  seaTemp: number;
  freightCost: number;
  progress: number;
  lat: number;
  lng: number;
  course: number;
  waypoints: { name: string; lat: number; lng: number; eta: string; passed: boolean }[];
  cargoTemp: number;
  draft: number;
  flag: string;
}

// ── Types ────────────────────────────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";
export type ServiceCategory = "express" | "standard" | "economy" | "freight" | "specialized";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  status: BookingStatus;
  origin: string;
  destination: string;
  scheduledDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
  items: number;
  weight: number;
  cost: number;
  co2Saved: number;
  timeline: { time: string; event: string; status: "done" | "current" | "pending" }[];
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  pricePerKg: number;
  basePrice: number;
  estimatedHours: number;
  features: string[];
  rating: number;
  reviews: number;
  co2Estimate: number;
  popular: boolean;
}

export interface PastShipment {
  id: string;
  bookingId: string;
  serviceName: string;
  origin: string;
  destination: string;
  deliveredDate: string;
  weight: number;
  cost: number;
  rating: number | null;
  co2Saved: number;
}

export interface Notification {
  id: string;
  type: "delivery" | "booking" | "promo" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ── Bookings ─────────────────────────────────────────────────────────────
export const bookings: Booking[] = [
  {
    id: "BK-4821",
    serviceId: "svc-1",
    serviceName: "Eco Express",
    category: "express",
    status: "in-transit",
    origin: "San Francisco, CA",
    destination: "Portland, OR",
    scheduledDate: "2026-08-20",
    estimatedDelivery: "2026-08-23",
    trackingNumber: "ECO-7X9K2M",
    items: 3,
    weight: 12.4,
    cost: 34.72,
    co2Saved: 1.8,
    timeline: [
      { time: "Aug 20, 10:15 AM", event: "Booking confirmed and label created", status: "done" },
      { time: "Aug 20, 02:30 PM", event: "Package picked up from origin", status: "done" },
      { time: "Aug 21, 08:00 AM", event: "In transit — Sacramento sorting facility", status: "done" },
      { time: "Aug 21, 04:45 PM", event: "Out for delivery to destination hub", status: "current" },
      { time: "Aug 23, 10:00 AM", event: "Estimated delivery", status: "pending" },
    ],
  },
  {
    id: "BK-4798",
    serviceId: "svc-3",
    serviceName: "Green Freight",
    category: "freight",
    status: "confirmed",
    origin: "Austin, TX",
    destination: "Denver, CO",
    scheduledDate: "2026-08-24",
    estimatedDelivery: "2026-08-28",
    trackingNumber: "ECO-3R8N1P",
    items: 12,
    weight: 84.0,
    cost: 126.00,
    co2Saved: 14.2,
    timeline: [
      { time: "Aug 22, 09:00 AM", event: "Booking confirmed", status: "done" },
      { time: "Aug 24, 08:00 AM", event: "Scheduled pickup", status: "current" },
      { time: "Aug 28, 05:00 PM", event: "Estimated delivery", status: "pending" },
    ],
  },
  {
    id: "BK-4785",
    serviceId: "svc-2",
    serviceName: "Standard Eco",
    category: "standard",
    status: "pending",
    origin: "Seattle, WA",
    destination: "San Francisco, CA",
    scheduledDate: "2026-08-25",
    estimatedDelivery: "2026-08-29",
    trackingNumber: "ECO-5T2W8L",
    items: 1,
    weight: 2.1,
    cost: 8.92,
    co2Saved: 0.4,
    timeline: [
      { time: "Aug 22, 11:30 AM", event: "Booking created — awaiting confirmation", status: "current" },
      { time: "Aug 25, 09:00 AM", event: "Scheduled pickup", status: "pending" },
      { time: "Aug 29, 05:00 PM", event: "Estimated delivery", status: "pending" },
    ],
  },
  {
    id: "BK-4760",
    serviceId: "svc-4",
    serviceName: "Priority Rush",
    category: "express",
    status: "delivered",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    scheduledDate: "2026-08-15",
    estimatedDelivery: "2026-08-16",
    trackingNumber: "ECO-9D4F6J",
    items: 5,
    weight: 8.3,
    cost: 29.05,
    co2Saved: 1.1,
    timeline: [
      { time: "Aug 15, 08:00 AM", event: "Booking confirmed", status: "done" },
      { time: "Aug 15, 11:15 AM", event: "Picked up from origin", status: "done" },
      { time: "Aug 15, 06:00 PM", event: "In transit — Phoenix hub", status: "done" },
      { time: "Aug 16, 09:30 AM", event: "Delivered — signed by recipient", status: "done" },
    ],
  },
  {
    id: "BK-4742",
    serviceId: "svc-5",
    serviceName: "Climate Neutral",
    category: "specialized",
    status: "delivered",
    origin: "New York, NY",
    destination: "Boston, MA",
    scheduledDate: "2026-08-10",
    estimatedDelivery: "2026-08-12",
    trackingNumber: "ECO-2H7K0M",
    items: 2,
    weight: 5.6,
    cost: 22.40,
    co2Saved: 3.8,
    timeline: [
      { time: "Aug 10, 10:00 AM", event: "Booking confirmed", status: "done" },
      { time: "Aug 10, 03:00 PM", event: "Picked up", status: "done" },
      { time: "Aug 11, 07:00 AM", event: "In transit", status: "done" },
      { time: "Aug 12, 11:45 AM", event: "Delivered", status: "done" },
    ],
  },
  {
    id: "BK-4718",
    serviceId: "svc-2",
    serviceName: "Standard Eco",
    category: "standard",
    status: "cancelled",
    origin: "Chicago, IL",
    destination: "Minneapolis, MN",
    scheduledDate: "2026-08-08",
    estimatedDelivery: "2026-08-12",
    trackingNumber: "ECO-6B3V1Q",
    items: 4,
    weight: 11.0,
    cost: 24.20,
    co2Saved: 0,
    timeline: [
      { time: "Aug 7, 02:00 PM", event: "Booking created", status: "done" },
      { time: "Aug 8, 09:00 AM", event: "Cancelled by customer", status: "done" },
    ],
  },
];

// ── Catalog ──────────────────────────────────────────────────────────────
export const catalog: CatalogItem[] = [
  {
    id: "svc-1",
    name: "Eco Express",
    description: "Next-day delivery powered by electric vehicles. Fastest option with zero tailpipe emissions for urgent shipments.",
    category: "express",
    pricePerKg: 2.80,
    basePrice: 12.00,
    estimatedHours: 24,
    features: ["Next-day delivery", "Zero-emission fleet", "Real-time tracking", "Signature required"],
    rating: 4.9,
    reviews: 1243,
    co2Estimate: 0.15,
    popular: true,
  },
  {
    id: "svc-2",
    name: "Standard Eco",
    description: "Reliable 3–5 day delivery using optimized low-emission routes. The balanced choice for everyday shipments.",
    category: "standard",
    pricePerKg: 1.20,
    basePrice: 5.00,
    estimatedHours: 96,
    features: ["3–5 day delivery", "Optimized green routes", "Tracking included", "Up to 25 kg"],
    rating: 4.7,
    reviews: 3891,
    co2Estimate: 0.08,
    popular: true,
  },
  {
    id: "svc-3",
    name: "Green Freight",
    description: "Bulk shipping for large or heavy items. Consolidated loads and route sharing cut per-unit emissions significantly.",
    category: "freight",
    pricePerKg: 1.50,
    basePrice: 45.00,
    estimatedHours: 120,
    features: ["Bulk discounts", "Consolidated loads", "Warehouse pickup", "Palletized handling"],
    rating: 4.6,
    reviews: 876,
    co2Estimate: 0.05,
    popular: false,
  },
  {
    id: "svc-4",
    name: "Priority Rush",
    description: "Guaranteed same-day or next-morning delivery. Premium service for time-critical packages.",
    category: "express",
    pricePerKg: 3.50,
    basePrice: 18.00,
    estimatedHours: 12,
    features: ["Same-day available", "Priority handling", "Live GPS tracking", "Insurance included"],
    rating: 4.8,
    reviews: 2105,
    co2Estimate: 0.22,
    popular: false,
  },
  {
    id: "svc-5",
    name: "Climate Neutral",
    description: "Fully carbon-offset shipping. Every gram of CO₂ is measured and compensated through verified reforestation projects.",
    category: "specialized",
    pricePerKg: 4.00,
    basePrice: 15.00,
    estimatedHours: 72,
    features: ["100% carbon offset", "Certified reforestation", "Impact report included", "Eco packaging"],
    rating: 4.9,
    reviews: 654,
    co2Estimate: 0.0,
    popular: false,
  },
  {
    id: "svc-6",
    name: "Economy Green",
    description: "Budget-friendly shipping with a conscience. Longer delivery window but lowest cost and emissions per package.",
    category: "economy",
    pricePerKg: 0.80,
    basePrice: 3.00,
    estimatedHours: 168,
    features: ["Lowest price", "Minimal emissions", "5–7 day window", "Drop-off available"],
    rating: 4.5,
    reviews: 5420,
    co2Estimate: 0.04,
    popular: true,
  },
];

// ── Past Shipments ───────────────────────────────────────────────────────
export const pastShipments: PastShipment[] = [
  {
    id: "PS-001",
    bookingId: "BK-4760",
    serviceName: "Priority Rush",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    deliveredDate: "2026-08-16",
    weight: 8.3,
    cost: 29.05,
    rating: 5,
    co2Saved: 1.1,
  },
  {
    id: "PS-002",
    bookingId: "BK-4742",
    serviceName: "Climate Neutral",
    origin: "New York, NY",
    destination: "Boston, MA",
    deliveredDate: "2026-08-12",
    weight: 5.6,
    cost: 22.40,
    rating: 5,
    co2Saved: 3.8,
  },
  {
    id: "PS-003",
    bookingId: "BK-4718",
    serviceName: "Standard Eco",
    origin: "Chicago, IL",
    destination: "Minneapolis, MN",
    deliveredDate: "2026-08-05",
    weight: 7.2,
    cost: 13.64,
    rating: 4,
    co2Saved: 0.9,
  },
  {
    id: "PS-004",
    bookingId: "BK-4690",
    serviceName: "Eco Express",
    origin: "Denver, CO",
    destination: "Salt Lake City, UT",
    deliveredDate: "2026-08-02",
    weight: 3.1,
    cost: 20.68,
    rating: 5,
    co2Saved: 0.6,
  },
  {
    id: "PS-005",
    bookingId: "BK-4655",
    serviceName: "Economy Green",
    origin: "Portland, OR",
    destination: "Boise, ID",
    deliveredDate: "2026-07-28",
    weight: 14.8,
    cost: 14.84,
    rating: 4,
    co2Saved: 2.1,
  },
  {
    id: "PS-006",
    bookingId: "BK-4620",
    serviceName: "Green Freight",
    origin: "Houston, TX",
    destination: "Dallas, TX",
    deliveredDate: "2026-07-22",
    weight: 62.0,
    cost: 138.00,
    rating: 5,
    co2Saved: 11.4,
  },
  {
    id: "PS-007",
    bookingId: "BK-4588",
    serviceName: "Priority Rush",
    origin: "Miami, FL",
    destination: "Orlando, FL",
    deliveredDate: "2026-07-18",
    weight: 1.2,
    cost: 22.20,
    rating: 5,
    co2Saved: 0.3,
  },
  {
    id: "PS-008",
    bookingId: "BK-4550",
    serviceName: "Standard Eco",
    origin: "San Jose, CA",
    destination: "Sacramento, CA",
    deliveredDate: "2026-07-12",
    weight: 9.4,
    cost: 16.28,
    rating: 4,
    co2Saved: 1.2,
  },
];

// ── Notifications ────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  {
    id: "n1",
    type: "delivery",
    title: "Out for delivery",
    message: "Your Eco Express shipment (ECO-7X9K2M) is out for delivery and arriving today.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "booking",
    title: "Booking confirmed",
    message: "Your Green Freight booking (BK-4798) has been confirmed. Pickup is scheduled for Aug 24.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "n3",
    type: "promo",
    title: "Save 15% on Climate Neutral",
    message: "This week only — get 15% off Climate Neutral shipping. Use code GREEN15 at checkout.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n4",
    type: "system",
    title: "Schedule maintenance window",
    message: "Eco Fleet Command will undergo maintenance on Aug 25 from 2:00–4:00 AM UTC. Bookings may be delayed.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "n5",
    type: "delivery",
    title: "Delivered",
    message: "Your Climate Neutral shipment (ECO-2H7K0M) was delivered to Boston, MA. Rate your experience!",
    time: "10 days ago",
    read: true,
  },
];

// ── Customer Stats ───────────────────────────────────────────────────────
// ── India Shipping ──────────────────────────────────────────────────────
export interface IndiaCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  hub: boolean;
}

export interface ShipmentVehicle {
  id: string;
  name: string;
  icon: string;
  capacity: string;
  speed: string;
  pricePerKm: number;
  co2PerKm: number;
  description: string;
}

export interface ShipmentType {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
  description: string;
  features: string[];
}

export const indiaCities: IndiaCity[] = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.08, lng: 72.88, mapX: 290, mapY: 395, hub: true },
  { name: "Delhi", state: "Delhi NCR", lat: 28.61, lng: 77.21, mapX: 330, mapY: 200, hub: true },
  { name: "Bangalore", state: "Karnataka", lat: 12.97, lng: 77.59, mapX: 255, mapY: 510, hub: true },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.08, lng: 80.27, mapX: 285, mapY: 500, hub: true },
  { name: "Kolkata", state: "West Bengal", lat: 22.57, lng: 88.36, mapX: 470, mapY: 340, hub: true },
  { name: "Hyderabad", state: "Telangana", lat: 17.39, lng: 78.49, mapX: 280, mapY: 420, hub: true },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.02, lng: 72.57, mapX: 230, mapY: 310, hub: false },
  { name: "Pune", state: "Maharashtra", lat: 18.52, lng: 73.86, mapX: 265, mapY: 405, hub: false },
  { name: "Jaipur", state: "Rajasthan", lat: 26.91, lng: 75.79, mapX: 275, mapY: 240, hub: false },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.85, lng: 80.95, mapX: 365, mapY: 230, hub: false },
  { name: "Chandigarh", state: "Punjab", lat: 30.73, lng: 76.78, mapX: 310, mapY: 170, hub: false },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.26, lng: 77.41, mapX: 310, mapY: 305, hub: false },
  { name: "Patna", state: "Bihar", lat: 25.60, lng: 85.10, mapX: 420, mapY: 260, hub: false },
  { name: "Kochi", state: "Kerala", lat: 9.93, lng: 76.27, mapX: 210, mapY: 555, hub: false },
  { name: "Guwahati", state: "Assam", lat: 26.14, lng: 91.74, mapX: 510, mapY: 250, hub: false },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.01, lng: 76.96, mapX: 240, mapY: 530, hub: false },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.69, lng: 83.22, mapX: 330, mapY: 415, hub: false },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.72, lng: 75.86, mapX: 280, mapY: 315, hub: false },
  { name: "Nagpur", state: "Maharashtra", lat: 21.15, lng: 79.09, mapX: 330, mapY: 355, hub: false },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.52, lng: 76.94, mapX: 220, mapY: 570, hub: false },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.32, lng: 83.01, mapX: 400, mapY: 270, hub: false },
  { name: "Amritsar", state: "Punjab", lat: 31.63, lng: 74.87, mapX: 290, mapY: 155, hub: false },
  { name: "Surat", state: "Gujarat", lat: 21.17, lng: 72.83, mapX: 230, mapY: 345, hub: false },
  { name: "Ranchi", state: "Jharkhand", lat: 23.34, lng: 85.31, mapX: 410, mapY: 300, hub: false },
  { name: "Raipur", state: "Chhattisgarh", lat: 21.25, lng: 81.63, mapX: 370, mapY: 345, hub: false },
  { name: "Bhubaneswar", state: "Odisha", lat: 20.30, lng: 85.82, mapX: 400, mapY: 365, hub: false },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.32, lng: 78.03, mapX: 330, mapY: 175, hub: false },
  { name: "Mysore", state: "Karnataka", lat: 12.30, lng: 76.66, mapX: 240, mapY: 520, hub: false },
  { name: "Mangalore", state: "Karnataka", lat: 12.87, lng: 74.84, mapX: 225, mapY: 515, hub: false },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.24, lng: 73.02, mapX: 240, mapY: 250, hub: false },
];

export const shipmentVehicles: ShipmentVehicle[] = [
  { id: "ev-van", name: "Electric Van", icon: "🚐", capacity: "Up to 500 kg", speed: "City: 2–4h", pricePerKm: 12, co2PerKm: 0, description: "Zero-emission urban delivery. Best for city-to-city under 500 km." },
  { id: "cng-truck", name: "CNG Truck", icon: "🚛", capacity: "Up to 2,000 kg", speed: "State: 6–12h", pricePerKm: 8, co2PerKm: 0.3, description: "Low-emission intercity freight. Balanced cost and speed." },
  { id: "ev-truck", name: "EV Heavy Truck", icon: "🚚", capacity: "Up to 5,000 kg", speed: "Regional: 12–24h", pricePerKm: 10, co2PerKm: 0, description: "Full-electric long-haul. Zero tailpipe emissions for heavy cargo." },
  { id: "rail", name: "Green Rail", icon: "🚂", capacity: "Up to 20,000 kg", speed: "Pan-India: 2–5d", pricePerKm: 3, co2PerKm: 0.1, description: "Lowest-cost, lowest-emission for bulk long-distance shipments." },
  { id: "air", name: "Express Air", icon: "✈️", capacity: "Up to 100 kg", speed: "Same-day: 2–8h", pricePerKm: 45, co2PerKm: 2.8, description: "Fastest option for urgent, lightweight parcels." },
];

export const shipmentTypes: ShipmentType[] = [
  { id: "standard", name: "Standard", icon: "📦", multiplier: 1.0, description: "Regular parcel delivery with standard handling.", features: ["Standard packaging", "2–5 day delivery", "Basic tracking", "Insurance included"] },
  { id: "express", name: "Express", icon: "⚡", multiplier: 1.8, description: "Priority handling with expedited transit.", features: ["Priority handling", "1–2 day delivery", "Live tracking", "Signature required"] },
  { id: "fragile", name: "Fragile / Premium", icon: "💎", multiplier: 2.2, description: "Special handling for delicate or high-value items.", features: ["Cushioned packaging", "Temperature control", "White-glove delivery", "Full insurance"] },
  { id: "bulk", name: "Bulk / Industrial", icon: "🏭", multiplier: 0.7, description: "Optimized for large-volume or palletized cargo.", features: ["Palletized loading", "Forklift handling", "Warehouse pickup", "Volume discounts"] },
];

export const customerStats = {
  totalBookings: 24,
  activeShipments: 3,
  totalSpent: 1847.50,
  co2Saved: 42.6,
  averageRating: 4.8,
  favoriteService: "Eco Express",
  memberSince: "March 2025",
  accountTier: "Green Plus",
};

// ── Energy Logistics Shipments ──────────────────────────────────────────
export const energyShipments: EnergyShipment[] = [
  {
    id: "ES-001",
    vesselName: "MT Desh Shobha",
    vesselClass: "VLCC",
    imo: "IMO 9164452",
    origin: "Ras Tanura",
    destination: "Jamnagar Refinery",
    crudeType: "Arabian Light",
    payload: "2.0M Barrels (Arabian Light)",
    payloadBarrels: 2000000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 3.5,
    etaOriginalDays: 3.5,
    speed: 14.2,
    seaTemp: 28.3,
    freightCost: 14.20,
    progress: 72,
    lat: 21.3,
    lng: 68.5,
    course: 125,
    waypoints: [
      { name: "Ras Tanura Terminal", lat: 26.64, lng: 50.16, eta: "Aug 18", passed: true },
      { name: "Strait of Hormuz", lat: 26.56, lng: 56.25, eta: "Aug 19", passed: true },
      { name: "Arabian Sea", lat: 18.5, lng: 64.0, eta: "Aug 21", passed: true },
      { name: "Jamnagar Refinery", lat: 22.47, lng: 70.06, eta: "Aug 24", passed: false },
    ],
    cargoTemp: 42.1,
    draft: 22.6,
    flag: "India",
  },
  {
    id: "ES-002",
    vesselName: "MT Jag Aparna",
    vesselClass: "Suezmax",
    imo: "IMO 9215524",
    origin: "Basra Terminal",
    destination: "Paradip Port",
    crudeType: "Basrah Medium",
    payload: "1.0M Barrels (Basrah Medium)",
    payloadBarrels: 1000000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 5.8,
    etaOriginalDays: 5.8,
    speed: 13.8,
    seaTemp: 27.9,
    freightCost: 16.50,
    progress: 48,
    lat: 16.2,
    lng: 62.3,
    course: 98,
    waypoints: [
      { name: "Basra Terminal", lat: 30.5, lng: 47.8, eta: "Aug 16", passed: true },
      { name: "Shatt al-Arab", lat: 29.5, lng: 48.5, eta: "Aug 17", passed: true },
      { name: "Gulf of Oman", lat: 24.5, lng: 58.5, eta: "Aug 19", passed: true },
      { name: "Arabian Sea Midpoint", lat: 14.0, lng: 65.0, eta: "Aug 22", passed: false },
      { name: "Paradip Port", lat: 20.3, lng: 86.6, eta: "Aug 28", passed: false },
    ],
    cargoTemp: 38.7,
    draft: 17.1,
    flag: "India",
  },
  {
    id: "ES-003",
    vesselName: "MT Ratna Puja",
    vesselClass: "Aframax",
    imo: "IMO 9308776",
    origin: "Bonny Terminal",
    destination: "Mangalore SPR",
    crudeType: "Bonny Light",
    payload: "1.9M Barrels (Bonny Light)",
    payloadBarrels: 900000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 8.2,
    etaOriginalDays: 8.2,
    speed: 12.5,
    seaTemp: 26.1,
    freightCost: 18.80,
    progress: 31,
    lat: 4.5,
    lng: 35.2,
    course: 78,
    waypoints: [
      { name: "Bonny Terminal", lat: 4.43, lng: 7.15, eta: "Aug 14", passed: true },
      { name: "Gulf of Guinea", lat: 3.0, lng: 5.0, eta: "Aug 15", passed: true },
      { name: "Cape of Good Hope", lat: -34.2, lng: 18.5, eta: "Aug 22", passed: false },
      { name: "Indian Ocean", lat: -10.0, lng: 55.0, eta: "Aug 26", passed: false },
      { name: "Mangalore SPR", lat: 12.87, lng: 74.84, eta: "Sep 1", passed: false },
    ],
    cargoTemp: 35.4,
    draft: 14.2,
    flag: "Nigeria",
  },
  {
    id: "ES-004",
    vesselName: "MT New Diamond",
    vesselClass: "VLCC",
    imo: "IMO 9189034",
    origin: "Ras Laffan",
    destination: "Mumbai Refinery",
    crudeType: "Dubai",
    payload: "2.1M Barrels (Dubai Crude)",
    payloadBarrels: 2100000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 4.1,
    etaOriginalDays: 4.1,
    speed: 15.1,
    seaTemp: 29.0,
    freightCost: 13.90,
    progress: 65,
    lat: 20.1,
    lng: 64.8,
    course: 112,
    waypoints: [
      { name: "Ras Laffan Terminal", lat: 25.93, lng: 51.55, eta: "Aug 17", passed: true },
      { name: "Strait of Hormuz", lat: 26.56, lng: 56.25, eta: "Aug 18", passed: true },
      { name: "Arabian Sea", lat: 17.0, lng: 62.0, eta: "Aug 20", passed: true },
      { name: "Mumbai Refinery", lat: 19.0, lng: 72.85, eta: "Aug 25", passed: false },
    ],
    cargoTemp: 44.2,
    draft: 22.8,
    flag: "Qatar",
  },
  {
    id: "ES-005",
    vesselName: "MT South Summit",
    vesselClass: "Suezmax",
    imo: "IMO 9407503",
    origin: "Mediterranean Hub",
    destination: "Paradip Port",
    crudeType: "Iran Heavy",
    payload: "1.0M Barrels (Iran Heavy)",
    payloadBarrels: 1000000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 6.0,
    etaOriginalDays: 6.0,
    speed: 14.0,
    seaTemp: 25.5,
    freightCost: 17.20,
    progress: 42,
    lat: 12.5,
    lng: 48.0,
    course: 105,
    waypoints: [
      { name: "Mediterranean Hub", lat: 35.8, lng: 14.5, eta: "Aug 12", passed: true },
      { name: "Suez Canal", lat: 30.0, lng: 32.55, eta: "Aug 14", passed: true },
      { name: "Red Sea", lat: 20.0, lng: 38.0, eta: "Aug 16", passed: true },
      { name: "Gulf of Aden", lat: 12.5, lng: 45.0, eta: "Aug 18", passed: true },
      { name: "Paradip Port", lat: 20.3, lng: 86.6, eta: "Aug 28", passed: false },
    ],
    cargoTemp: 36.8,
    draft: 17.0,
    flag: "Iran",
  },
  {
    id: "ES-006",
    vesselName: "MT BW Mahanadi",
    vesselClass: "Aframax",
    imo: "IMO 9350448",
    origin: "Fujairah Terminal",
    destination: "Cochin Refinery",
    crudeType: "Mars",
    payload: "0.85M Barrels (Mars Blend)",
    payloadBarrels: 850000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 2.1,
    etaOriginalDays: 2.1,
    speed: 13.5,
    seaTemp: 28.8,
    freightCost: 15.60,
    progress: 85,
    lat: 13.8,
    lng: 72.2,
    course: 175,
    waypoints: [
      { name: "Fujairah Terminal", lat: 25.12, lng: 56.33, eta: "Aug 20", passed: true },
      { name: "Gulf of Oman", lat: 24.5, lng: 58.5, eta: "Aug 20", passed: true },
      { name: "Arabian Sea", lat: 16.0, lng: 68.0, eta: "Aug 22", passed: true },
      { name: "Cochin Refinery", lat: 9.93, lng: 76.27, eta: "Aug 24", passed: false },
    ],
    cargoTemp: 40.5,
    draft: 13.8,
    flag: "Liberia",
  },
  {
    id: "ES-007",
    vesselName: "MT Gemini Spirit",
    vesselClass: "Panamax",
    imo: "IMO 9418219",
    origin: "Basra Terminal",
    destination: "Paradip Port",
    crudeType: "Basrah Heavy",
    payload: "0.6M Barrels (Basrah Heavy)",
    payloadBarrels: 600000,
    status: "docked",
    disruption: "NONE",
    etaDays: 0,
    etaOriginalDays: 7.5,
    speed: 0,
    seaTemp: 29.1,
    freightCost: 19.40,
    progress: 100,
    lat: 20.3,
    lng: 86.6,
    course: 0,
    waypoints: [
      { name: "Basra Terminal", lat: 30.5, lng: 47.8, eta: "Aug 10", passed: true },
      { name: "Paradip Port", lat: 20.3, lng: 86.6, eta: "Aug 19", passed: true },
    ],
    cargoTemp: 33.2,
    draft: 12.5,
    flag: "India",
  },
  {
    id: "ES-008",
    vesselName: "MT Pacific Voyager",
    vesselClass: "Suezmax",
    imo: "IMO 9250423",
    origin: "Ras Tanura",
    destination: "Visakhapatnam Refinery",
    crudeType: "Oman",
    payload: "1.0M Barrels (Oman Crude)",
    payloadBarrels: 1000000,
    status: "in-transit",
    disruption: "NONE",
    etaDays: 5.2,
    etaOriginalDays: 5.2,
    speed: 14.8,
    seaTemp: 27.6,
    freightCost: 15.10,
    progress: 55,
    lat: 17.8,
    lng: 65.2,
    course: 108,
    waypoints: [
      { name: "Ras Tanura Terminal", lat: 26.64, lng: 50.16, eta: "Aug 16", passed: true },
      { name: "Strait of Hormuz", lat: 26.56, lng: 56.25, eta: "Aug 17", passed: true },
      { name: "Arabian Sea", lat: 15.0, lng: 63.0, eta: "Aug 20", passed: true },
      { name: "Visakhapatnam", lat: 17.69, lng: 83.22, eta: "Aug 27", passed: false },
    ],
    cargoTemp: 41.3,
    draft: 17.2,
    flag: "Singapore",
  },
];
