// @vitest-environment jsdom
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useSimulation } from './use-simulation';
import { useSimulationStore } from '../store/simulation-store';

describe('useSimulation custom hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSimulationStore.getState().resetStore();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  test('should not trigger tick when simulation is paused', () => {
    useSimulationStore.getState().updateState({ isPaused: true, timeMultiplier: 1 });

    const tickSpy = vi.spyOn(useSimulationStore.getState(), 'tick');
    renderHook(() => useSimulation());

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(tickSpy).not.toHaveBeenCalled();
  });

  test('should trigger tick based on timeMultiplier when not paused', () => {
    useSimulationStore.getState().updateState({ isPaused: false, timeMultiplier: 1 });

    const tickSpy = vi.spyOn(useSimulationStore.getState(), 'tick');
    renderHook(() => useSimulation());

    // Clear any calls that might have happened during rendering/setup
    tickSpy.mockClear();

    act(() => {
      // 1x multiplier interval is 5000ms
      vi.advanceTimersByTime(5000);
    });

    expect(tickSpy).toHaveBeenCalledTimes(1);
  });

  test('should trigger tick faster when timeMultiplier is higher', () => {
    useSimulationStore.getState().updateState({ isPaused: false, timeMultiplier: 2 });

    const tickSpy = vi.spyOn(useSimulationStore.getState(), 'tick');
    renderHook(() => useSimulation());

    // Clear any calls that might have happened during rendering/setup
    tickSpy.mockClear();

    act(() => {
      // 2x multiplier interval is 2500ms
      vi.advanceTimersByTime(2500);
    });

    expect(tickSpy).toHaveBeenCalledTimes(1);
  });
});
