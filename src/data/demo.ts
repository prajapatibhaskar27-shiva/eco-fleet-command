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
