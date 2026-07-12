/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { SimulationState, Incident, Gate, StadiumZone, TransitRoute } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { GATES, ZONES, TRANSIT_ROUTES } from '../data/stadium';

interface SimulationStore {
  state: SimulationState;
  incidents: Incident[];
  gates: Gate[];
  zones: StadiumZone[];
  transit: TransitRoute[];
  setScenario: (scenarioId: string) => void;
  updateState: (update: Partial<SimulationState>) => void;
  addIncident: (incident: Incident) => void;
  resolveIncident: (id: string) => void;
  tick: () => void;
  resetStore: () => void;
}

const getDefaultIncidents = (): Incident[] => [
  {
    id: 'inc-1',
    type: 'crowd',
    severity: 'critical',
    title: 'Gate B Crowd Surge',
    description: 'Unexpected high density detected at Gate B. Transit shuttle synchronization failure suspected.',
    location: [19.3029, -99.1485],
    zoneId: 'East Upper Deck',
    timestamp: new Date().toISOString(),
    status: 'new'
  },
  {
    id: 'inc-2',
    type: 'accessibility',
    severity: 'medium',
    title: 'Elevator Outage: North Concourse',
    description: 'Elevator EL-04 is currently out of service for maintenance. Rerouting accessibility users to EL-05.',
    location: [19.3045, -99.1505],
    zoneId: 'North Lower Concourse',
    timestamp: new Date().toISOString(),
    status: 'acknowledged'
  }
];

export const useSimulationStore = create<SimulationStore>((set) => ({
  state: SCENARIOS[0].initialState,
  incidents: getDefaultIncidents(),
  gates: GATES,
  zones: ZONES,
  transit: TRANSIT_ROUTES,
  setScenario: (scenarioId) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
    set({ state: scenario.initialState });
    // Logic to update gates/zones based on scenario could be added here
  },
  updateState: (update) => set((s) => ({ state: { ...s.state, ...update } })),
  addIncident: (incident) => set((s) => ({ incidents: [incident, ...s.incidents] })),
  resolveIncident: (id) => set((s) => ({
    incidents: s.incidents.map(i => i.id === id ? { ...i, status: 'resolved' } : i)
  })),
  tick: () => set((s) => {
    if (s.state.isPaused) return s;
    // Simulate minor fluctuations
    return {
      gates: s.gates.map(g => ({
        ...g,
        currentQueueTime: Math.round(Math.max(2, g.currentQueueTime + (Math.random() > 0.5 ? 1 : -1) * (s.state.globalDensity)))
      })),
      zones: s.zones.map(z => ({
        ...z,
        currentDensity: parseFloat(Math.min(1, Math.max(0.1, z.currentDensity + (Math.random() - 0.5) * 0.05)).toFixed(2))
      }))
    };
  }),
  resetStore: () => set({
    state: SCENARIOS[0].initialState,
    incidents: getDefaultIncidents(),
    gates: GATES,
    zones: ZONES,
    transit: TRANSIT_ROUTES,
  }),
}));
