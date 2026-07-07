/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationState } from '../types';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  initialState: SimulationState;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'normal-arrival',
    name: 'Normal Match Arrival',
    description: 'Standard fan flow before kickoff with balanced gate usage.',
    initialState: {
      scenario: 'normal-arrival',
      timeMultiplier: 1,
      isPaused: false,
      weather: { temp: 24, condition: 'sunny', visibility: 100 },
      globalDensity: 0.4,
      transitReliability: 0.95
    }
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    description: 'Stormy weather causing slower movement and transit delays.',
    initialState: {
      scenario: 'heavy-rain',
      timeMultiplier: 1,
      isPaused: false,
      weather: { temp: 18, condition: 'rainy', visibility: 40 },
      globalDensity: 0.5,
      transitReliability: 0.6
    }
  },
  {
    id: 'transit-delay',
    name: 'Major Transit Delay',
    description: 'Metro line disruption causing a surge at shuttle points.',
    initialState: {
      scenario: 'transit-delay',
      timeMultiplier: 1,
      isPaused: false,
      weather: { temp: 25, condition: 'sunny', visibility: 100 },
      globalDensity: 0.4,
      transitReliability: 0.2
    }
  },
  {
    id: 'gate-closure',
    name: 'Gate B Closure',
    description: 'Security incident at Gate B requiring redistribution of fans.',
    initialState: {
      scenario: 'gate-closure',
      timeMultiplier: 1,
      isPaused: false,
      weather: { temp: 24, condition: 'sunny', visibility: 100 },
      globalDensity: 0.6,
      transitReliability: 0.9
    }
  },
  {
    id: 'exit-surge',
    name: 'Post-Match Exit Surge',
    description: 'Mass egress after the final whistle.',
    initialState: {
      scenario: 'exit-surge',
      timeMultiplier: 2,
      isPaused: false,
      weather: { temp: 20, condition: 'sunny', visibility: 100 },
      globalDensity: 0.9,
      transitReliability: 0.8
    }
  }
];
