/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/app-store';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import FanDashboard from './pages/FanDashboard';
import FanNavigate from './pages/FanNavigate';
import FanAssistant from './pages/FanAssistant';
import FanImpact from './pages/FanImpact';
import OperationsDashboard from './pages/OperationsDashboard';
import CrowdIntelligence from './pages/OperationsCrowd';
import AlertsResponse from './pages/OperationsAlerts';
import OperationsInsights from './pages/OperationsInsights';
import VolunteerHub from './pages/VolunteerHub';
import AccessibilityExperience from './pages/AccessibilityExperience';
import SimulationCenter from './pages/SimulationCenter';
import SettingsPage from './pages/SettingsPage';
import AppShell from './components/layout/AppShell';
import { useSimulation } from './hooks/use-simulation';

export default function App() {
  const { isHighContrast, isReducedMotion, fontSize } = useAppStore();
  useSimulation();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', true); // Primary dark theme
    root.classList.toggle('high-contrast', isHighContrast);
    root.classList.toggle('reduced-motion', isReducedMotion);
    root.setAttribute('data-font-size', fontSize);
  }, [isHighContrast, isReducedMotion, fontSize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        <Route element={<AppShell />}>
          {/* Fan Routes */}
          <Route path="/fan" element={<FanDashboard />} />
          <Route path="/fan/navigate" element={<FanNavigate />} />
          <Route path="/fan/assistant" element={<FanAssistant />} />
          <Route path="/fan/impact" element={<FanImpact />} />

          {/* Operations Routes */}
          <Route path="/operations" element={<OperationsDashboard />} />
          <Route path="/operations/crowd" element={<CrowdIntelligence />} />
          <Route path="/operations/alerts" element={<AlertsResponse />} />
          <Route path="/operations/insights" element={<OperationsInsights />} />

          {/* Volunteer Routes */}
          <Route path="/volunteer" element={<VolunteerHub />} />

          {/* Accessibility Routes */}
          <Route path="/accessibility" element={<AccessibilityExperience />} />

          {/* Simulation & Settings */}
          <Route path="/simulation" element={<SimulationCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

