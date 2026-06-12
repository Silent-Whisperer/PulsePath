# 🍃 CarbonBuddy AI — Personal Climate Coach & Footprint Diagnostic

CarbonBuddy AI is a premium, fully interactive carbon footprint dashboard and sustainability coach. Built with React, TypeScript, Tailwind CSS, Express, and Google Gemini AI, it helps users measure their lifestyle footprint, visualizes historical projection deltas, and provides contextual action items to accelerate the transition to Net Zero.

---

## 🚀 Key Features

* **Interactive Diagnostic Form**: Step-by-step wizard measuring transportation mileage, flight patterns, grid usage, diet types, retail consumption, and waste sorting habits.
* **Dual Unit System**: Instantly toggle between Metric (`kg CO2`, `km`) and Imperial (`lbs CO2`, `miles`) unit settings with seamless recalculations.
* **Dynamic Visualizations**: 
  - **Impact Pie Chart**: Hover-responsive distribution chart with instant sector-specific insights and climate facts.
  - **Strategic Projection Graph**: A 12-month area chart showing expected footprint decay, updating dynamically as you enable/disable priority actions.
* **Auto-Extract Receipt Scanner**: Built-in scanner to extract electricity usage or fuel purchases from images, equipped with automatic mock fallback simulation for offline testing.
* **Lilo AI Climate Coach**: Floating chatbot with memory of the user's questionnaire results, providing tailored advice on diet, energy, and travel.
* **Methodology & Context Modals**: Access detailed greenhouse gas emission factors (aligned with IPCC and WWF guidelines), profiles of specialized coaches, and community impact stats.
* **Print-to-PDF Report**: Clean, custom print styles that hide interactive elements (nav, chatbots, sidebars) and stretch the results to full width for a high-quality, professional document print-out.
* **Theme-Aware (Dark & Light Mode)**: Fully optimized dark-mode support with HSL tailored color schemes, glassmorphic cards, and GPU acceleration.
* **Comprehensive testing**: Verified calculations using unit test suites.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Recharts (Charts), Lucide React (Icons), Motion (Animations)
* **Backend**: Node.js, Express, `@google/genai` (Gemini SDK)
* **Styling**: Tailwind CSS (v4), Vanilla CSS (Custom selections, slider draggers, seams fixes)
* **Testing**: Standalone unit testing suite

---

## 💻 Running Locally

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **NPM** (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Silent-Whisperer/Carbon-Footprint.git
   cd Carbon-Footprint
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Define your `GEMINI_API_KEY` inside the `.env` file:
   ```env
   GEMINI_API_KEY="your-actual-api-key-here"
   APP_URL="http://localhost:3000"
   ```
   *Note: If the API key is not provided, the application will automatically fall back to simulated mock data for AI chat and document scanning, allowing you to test all client-side flows immediately.*

### Development Server
Run the local server (both Express API endpoints and Vite development server):
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Run Tests
Execute the calculation unit test suite:
```bash
npx tsx src/utils/calculations.test.ts
```

### Build & Production Start
Compile assets and build the Express production server:
```bash
npm run build
npm run start
```

---

## 🤝 Open-Source & Standards
This project is built under standard Greenhouse Gas (GHG) Protocol guidelines. Contributions, improvements, and recommendations are welcome!
