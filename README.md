# ⚡ FluxRoute | Energy Resilience & Maritime Digital Twin

<p align="center">
  <img src="public/logo.svg" alt="FluxRoute Logo" width="100" />
</p>

<p align="center">
  <strong>AI-Driven Maritime Supply Chain Resilience, Geopolitical Disruption Simulator & Strategic Petroleum Reserve (SPR) Orchestrator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Target-Problem_Statement_1-amber?style=for-the-badge&logo=target" alt="PS1" />
  <img src="https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Convex-Backend-ff5252?style=for-the-badge&logo=convex" alt="Convex" />
</p>

---

## 📌 Executive Summary

India imports **~87.8% of its domestic crude oil requirements**, with a major share transiting through vulnerable maritime chokepoints including the **Strait of Hormuz** and the **Bab-el-Mandeb / Red Sea corridor**. National underground caverns (Strategic Petroleum Reserves located in Mangalore, Padur, and Visakhapatnam) provide roughly **9.5 days of emergency buffer cover**.

**FluxRoute** bridges maritime geopolitical intelligence with end-to-end transport management across two distinct operational domains:

* **Maritime Energy Resilience & Disruption Simulator (PS1):** An interactive digital twin that simulates chokepoint blockades, models dynamic Strategic Petroleum Reserve (SPR) drawdowns, evaluates Cape of Good Hope rerouting latencies, and orchestrates alternative sweet crude procurement.
* **Domestic Fleet & Multi-Objective Freight Routing:** An algorithmic dispatch hub balancing high-efficiency highway routes with low-emission corridors, incorporating EV fleet allocation and carbon reduction metrics.

---

## 🚀 Core Capabilities

### 🌊 1. Maritime Digital Twin & Chokepoint Disruption Simulator
* **Interactive Sea Lane Visualization:** Real-time visual tracking of international crude transport lanes connecting Middle Eastern, West African, and Far-Eastern hubs to Indian energy ports (Jamnagar, Paradip, Vadinar).
* **Dynamic Geopolitical Crisis Modes:**
  * 🔴 **Strait of Hormuz Blockade:** Models a severe supply crunch, activates Cape of Good Hope contingency diversions (+14 days transit), and triggers an automated 1.1M bpd drawdown from Padur and Mangalore SPR caverns.
  * 🟡 **Red Sea Escalation:** Automatically reallocates Mediterranean orders to West African sweet crude (Bonny Light/Forcados) while accounting for real-time freight and insurance surcharges.
* **National Energy Resilience Index:** Real-time score evaluating import dependency ratios, current buffer capacity, and vessel transit latency.

### 🚢 2. Live Cargo & Supertanker (VLCC) Tracker
* **Supertanker Fleet Telemetry:** Instant visibility into vessel names, deadweight tonnage, crude grades (Arabian Light, Basrah Medium, Bonny Light), and dynamic countdowns for Arrival Estimates (ETA).
* **Automated Risk Rerouting:** Real-time route reassessment and penalty calculations applied whenever transit corridors enter hazardous alert zones.

### ⚡ 3. Adaptive Procurement Orchestrator
* **Ranked Alternative Sourcing:** Quantitative trade-off comparisons across global crude blends based on quality compatibility, transit times, and per-barrel cost deltas.
* **National Contingency Directives:** Instant compilation and export of operational contingency plans, vessel audit logs, and strategic inventory reports.

### 🚛 4. Domestic Fleet Management Engine
* **Multi-Objective Optimizer:** Evaluates fastest commercial routes alongside eco-optimized bypass paths to reduce overall transit emissions.
* **Fleet Telemetry & Carbon Accounting:** Live telemetry monitoring, EV cargo matching, payload tracking, and ESG compliance analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS, Radix UI Primitives, Lucide React Icons |
| **Routing & Navigation** | TanStack Router, React Context API |
| **Realtime Backend & State** | Convex Cloud Platform |
| **Geospatial & Vector Visuals**| Vector SVG Digital Twin, Leaflet / Maps API |

---

## 📂 Repository Structure

* **`public/`** — Static application assets, SVG icons, and web app manifests.
* **`src/components/`**
  * `ActiveShipments.tsx` — Live crude cargo cards and tanker telemetry tracking.
  * `MaritimeMap.tsx` — Vector-rendered global sea lanes, chokepoint zones, and dynamic rerouting paths.
  * `MaritimeOptimizer.tsx` — Procurement recommendations, SPR drawdown metrics, and contingency export.
  * `fleet/` — Domestic logistics, route optimization engines, and vehicle lists.
  * `ui/` — Accessible design system components and UI primitives.
* **`src/contexts/`** — Disruption scenario state providers and theme contexts.
* **`src/convex/`** — Backend data schemas, user authentication, and persistent data tables.
* **`src/data/`** — Curated vessel profiles, maritime corridors, and SPR facility datasets.
* **`src/routes/`** — Dashboard views featuring the integrated multi-modal switcher.

---

## ⚡ Setup & Execution

### Prerequisites
* Node.js v20.12.0 or newer (v22 LTS recommended)
* npm or bun package manager

### 1. Clone & Enter Repository
```
git clone [https://github.com/your-org/fluxroute-energy-twin.git](https://github.com/your-org/fluxroute-energy-twin.git)
cd fluxroute-energy-twin
```

### 2. Install Project Dependencies
```
npm install
```

### 3. Setup Environment Variables
```
cp .env.example .env
```

### 4. Launch Development Server
```
npm run dev
```

Access the application locally at `http://localhost:5173`.

---

## 🎮 Hackathon Presentation Guide (2-Minute Demo)

* **Baseline Energy Health (0:00 - 0:30):** Present the live maritime twin displaying nominal transit through the Persian Gulf and standard 9.5-day SPR reserve coverage.
* **Simulate Hormuz Crisis (0:30 - 1:00):** Activate the Hormuz Blockade simulation. Demonstrate the immediate route rerouting around the Cape of Good Hope, the flashing hazard markers, and the drop in national reserves to 4.1 days.
* **AI Procurement & Sourcing (1:00 - 1:30):** Review the automated procurement engine ranking alternative crude suppliers and show the one-click contingency export.
* **Domestic Synergy (1:30 - 2:00):** Switch to the Domestic Fleet mode to demonstrate multi-modal freight coordination from coastal terminals to inland destinations.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for complete details.
