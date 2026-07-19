# Pulse Path: FIFA World Cup 2026 Stadium Operations & Fan Intelligence

Pulse Path is an intelligent, real-time stadium operations and fan-experience network built for the FIFA World Cup 2026. It serves as a unified digital infrastructure connecting fans, volunteers, and stadium operations staff to ensure seamless match-day logistics, safety, and crowd management.

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

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, TailwindCSS, Lucide Icons, Recharts, Leaflet, Framer Motion
- **Backend:** Express, Node.js, TSX
- **Database / State:** Zustand (for client-side state synchronization)
- **AI Integration:** Google GenAI SDK (Gemini 1.5 Flash)
- **Security:** Helmet CSP hardening, Express rate limiters, Prompt injection detection, Tight JSON parser boundaries

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

## 🧪 Testing

Pulse Path comes equipped with unit and integration tests powered by Vitest.

To run the tests:

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
