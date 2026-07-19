# Pulse Path: FIFA World Cup 2026 Stadium Operations & Fan Intelligence

Pulse Path is an intelligent, real-time stadium operations and fan-experience network built for the FIFA World Cup 2026. It serves as a unified digital infrastructure connecting fans, volunteers, and stadium operations staff to ensure seamless match-day logistics, safety, and crowd management.

---

## 🎯 FIFA World Cup 2026 Problem Statement Alignment

Pulse Path is engineered to address the complex logistics, accessibility needs, and operational resiliency challenges of a multi-country, multi-city tournament (USA, Canada, and Mexico). Below is a mapping of the core problem requirements to our codebase features:

### 1. Unified Multi-Venue Orchestration
- **The Problem:** Coordinating across 16 different stadiums and host cities across North America.
- **Pulse Path Solution:** Features interactive onboarding where users select their specific host venue (e.g., Estadio Azteca, MetLife Stadium, SoFi Stadium). The system dynamically shifts map center points, queue predictions, incident mock locations, and active route paths relative to the selected venue.
- **Code Reference:** Configured in [stadium.ts](file:///d:/Pulse%20Path/src/data/stadium.ts) and dynamically rendered in [StadiumMap.tsx](file:///d:/Pulse%20Path/src/components/map/StadiumMap.tsx).

### 2. Multi-Lingual Fan Assistant & AI Copilot
- **The Problem:** Welcoming millions of international fans speaking diverse languages.
- **Pulse Path Solution:** Integrating a real-time Gemini-powered smart assistant supporting 5 major tournament languages (English, Spanish, French, Hindi, Arabic). It provides localized transit statuses, crowd density bypass suggestions, and official safety policies.
- **Code Reference:** Interface at [FanAssistant.tsx](file:///d:/Pulse%20Path/src/pages/FanAssistant.tsx) and backend endpoint `/api/ai` defined in [server.ts](file:///d:/Pulse%20Path/server.ts).

### 3. Accessible & Low-Sensory Navigation
- **The Problem:** Providing equal access and comfort for neurodivergent fans and fans with mobility needs.
- **Pulse Path Solution:** An Accessibility Suite with high-contrast UI mode, screen-reader optimizations, and font-size scaling. Features custom Leaflet navigation paths for **Step-Free routes** (avoiding stairs/escalators) and **Quiet Routes** (low-sensory corridors avoiding crowded areas).
- **Code Reference:** Defined in [AccessibilityExperience.tsx](file:///d:/Pulse%20Path/src/pages/AccessibilityExperience.tsx) and route calculators in [FanNavigate.tsx](file:///d:/Pulse%20Path/src/pages/FanNavigate.tsx).

### 4. Eco-Impact & Sustainability Tracking
- **The Problem:** Running a green tournament with minimal carbon footprint and plastic waste.
- **Pulse Path Solution:** Gamified tracking of eco-friendly behaviors (plastic water bottles saved, carbon offset by taking public transit, steps walked) rewarded with redeemable points.
- **Code Reference:** Page view in [FanImpact.tsx](file:///d:/Pulse%20Path/src/pages/FanImpact.tsx) and synchronized state via `useUserStore`.

### 5. Resilient Operations & Crowd Simulation
- **The Problem:** Preventing dangerous crowd surges and responding to real-time weather/transit disruptions.
- **Pulse Path Solution:** Command center with density mapping overlays, active incident tracking, and tactical simulators allowing staff to stress-test the venue with rainstorms, transit disruptions, and gate closures.
- **Code Reference:** Dashboards in [OperationsDashboard.tsx](file:///d:/Pulse%20Path/src/pages/OperationsDashboard.tsx) and [SimulationCenter.tsx](file:///d:/Pulse%20Path/src/pages/SimulationCenter.tsx).

### 6. Official Tournament Policies & Security Guardrails
- **The Problem:** Disseminating crucial security constraints (clear bag policy, transit benefits) and protecting infrastructure from malicious prompts.
- **Pulse Path Solution:** Dashboard policy cards detailing official clear bag constraints and free match-day public transit pass benefits. The backend implements CORS boundary checks, rate-limiting, and prompt-injection detection to secure AI systems.
- **Code Reference:** Policy card in [FanDashboard.tsx](file:///d:/Pulse%20Path/src/pages/FanDashboard.tsx) and protection filters in [server/utils/security.ts](file:///d:/Pulse%20Path/server/utils/security.ts).

---


## 🚀 Key Features

### 🏟️ Fan Experience

- **Match-Day Dashboard:** Digital match passes, live kickoff countdowns, and real-time gate entry conditions.
- **Interactive Navigation:** Leaflet-powered maps detailing gates, concession stands, medical points, and transit connections.
- **AI Smart Assistant:** A multilingual chat companion providing localized transit status, facility availability, and safety disclaimers.
- **Eco-Impact Tracker:** Real-time gamified tracking of bottles saved, carbon footprint avoided, steps walked, and rewards points.

### ⚙️ Operations & Crowd Control

- **Operations Dashboard:** Live system health indicators, incident feed monitoring, and active venue stats.
- **Crowd Intelligence:** Zone-by-zone density mapping (normal, medium, high, critical) with polygon overlays.
- **Alerts & Tactical Response:** Automated assignment of response teams and AI-powered recommendations for safety incidents.
- **Tactical Simulation Center:** Simulated weather stress-testing (rain, storms, high density, transit delays) to evaluate venue resiliency.

### 🤝 Volunteers & Accessibility

- **Volunteer Hub:** Organized checklist tasks, duty locations, status logging, and coordinator communication.
- **Accessibility Suite:** High-contrast toggle, screen-reader optimizations, font size controls, and custom accessible path routing.

---

## 🏗️ Architecture & Entry Points

Pulse Path is built as a split client-server SPA (Single Page Application). You can view the full design and state flow diagram inside the [ARCHITECTURE.md](ARCHITECTURE.md) document.

- **Vite React Entry**: [src/main.tsx](src/main.tsx)
- **Express Backend Entry**: [server.ts](server.ts)
- **Shared API Config**: [openapi.yaml](openapi.yaml)

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, TailwindCSS, Lucide Icons, Recharts, Leaflet, Framer Motion
- **Backend:** Express, Node.js, TSX, Zod (Request Validation)
- **Database / State:** Zustand (for client-side state synchronization)
- **AI Integration:** Google GenAI SDK (Gemini 1.5 Flash)
- **Security:** CORS origin limits, Helmet CSP hardening, Express rate limiters, Prompt injection detection, Tight JSON parser boundaries
- **Developer Tooling:** ESLint Flat Config, Prettier formatting, Husky + lint-staged (pre-commit checking)

---

## 💻 Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A Gemini API Key

### Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Silent-Whisperer/PulsePath.git
   cd PulsePath
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (using `.env.example` as a template):

   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Tooling

### Run Linter & TypeScript Type-Check
Pulse Path implements strict lint rules globally, excluding page templates to allow legacy flexibility:
```bash
npm run lint
```

### Auto-Format Codebase
Uses Prettier rules for clean indentations and layout structures:
```bash
npm run format
```

### Pre-commit Checks
Husky will automatically run Prettier and ESLint on your modified files before allowing a commit:
```bash
npx lint-staged
```

### Run Vitest Suites
Pulse Path comes equipped with unit and integration tests for React stores, simulation tickers, client utilities, and Express routes.
```bash
npm run test
```

---

## 🐳 Docker Deployment

A lightweight `Dockerfile` is provided for containerized environments.

1. **Build the Container:**

   ```bash
   docker build -t pulsepath .
   ```

2. **Run the Container:**
   ```bash
   docker run -p 3000:3000 --env GEMINI_API_KEY="your_key" pulsepath
   ```
