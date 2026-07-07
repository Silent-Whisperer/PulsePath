/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulation-store';

export function useSimulation() {
  const { tick, state } = useSimulationStore();

  useEffect(() => {
    if (state.isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 5000 / state.timeMultiplier);

    return () => clearInterval(interval);
  }, [state.isPaused, state.timeMultiplier, tick]);
}
