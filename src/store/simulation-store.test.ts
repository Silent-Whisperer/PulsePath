import { describe, test, expect, beforeEach } from 'vitest';
import { useSimulationStore } from './simulation-store';

describe('useSimulationStore state management', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useSimulationStore.getState().resetStore();
  });

  test('should initialize with correct default scenarios and state', () => {
    const { state, incidents, gates, zones, transit } = useSimulationStore.getState();
    expect(state.scenario).toBe('normal-arrival');
    expect(state.globalDensity).toBe(0.4);
    expect(incidents).toHaveLength(2);
    expect(gates).toHaveLength(4);
    expect(zones).toHaveLength(4);
    expect(transit).toHaveLength(2);
  });

  test('setScenario should update active scenario state', () => {
    const { setScenario } = useSimulationStore.getState();
    setScenario('heavy-rain');

    const { state } = useSimulationStore.getState();
    expect(state.scenario).toBe('heavy-rain');
    expect(state.globalDensity).toBe(0.5);
    expect(state.weather.condition).toBe('rainy');
  });

  test('updateState should modify partial state correctly', () => {
    const { updateState } = useSimulationStore.getState();
    updateState({ globalDensity: 0.9, isPaused: true });

    const { state } = useSimulationStore.getState();
    expect(state.globalDensity).toBe(0.9);
    expect(state.isPaused).toBe(true);
  });

  test('addIncident should append new incident to top of list', () => {
    const { addIncident } = useSimulationStore.getState();
    const newInc = {
      id: 'inc-test',
      type: 'medical' as const,
      severity: 'high' as const,
      title: 'Test Heat Stroke',
      description: 'Fan needs assistance in Sector 110.',
      location: [19.303, -99.15] as [number, number],
      zoneId: 'west-vip',
      timestamp: new Date().toISOString(),
      status: 'new' as const,
    };

    addIncident(newInc);

    const { incidents } = useSimulationStore.getState();
    expect(incidents).toHaveLength(3);
    expect(incidents[0].id).toBe('inc-test');
  });

  test('resolveIncident should set status to resolved', () => {
    const { resolveIncident } = useSimulationStore.getState();
    resolveIncident('inc-1');

    const { incidents } = useSimulationStore.getState();
    const incident = incidents.find((i) => i.id === 'inc-1');
    expect(incident?.status).toBe('resolved');
  });

  test('tick should modify gates queue times and zones density when not paused', () => {
    const { tick, updateState } = useSimulationStore.getState();
    updateState({ isPaused: false });
    tick();

    // After tick, gates and zones values should fluctuate
    const { gates, zones } = useSimulationStore.getState();
    expect(gates[0].currentQueueTime).toBeDefined();
    expect(zones[0].currentDensity).toBeDefined();
  });

  test('tick should not modify anything if simulation is paused', () => {
    const { tick, updateState } = useSimulationStore.getState();
    updateState({ isPaused: true });

    const initialGates = JSON.stringify(useSimulationStore.getState().gates);
    tick();

    const finalGates = JSON.stringify(useSimulationStore.getState().gates);
    expect(initialGates).toBe(finalGates);
  });

  test('resetStore should revert all modifications to defaults', () => {
    const { updateState, setScenario, resetStore } = useSimulationStore.getState();

    setScenario('gate-closure');
    updateState({ globalDensity: 0.95 });

    resetStore();

    const { state, incidents } = useSimulationStore.getState();
    expect(state.scenario).toBe('normal-arrival');
    expect(state.globalDensity).toBe(0.4);
    expect(incidents).toHaveLength(2);
  });
});
