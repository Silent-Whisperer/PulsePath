/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { SustainabilityStats, Message } from '../types';

interface UserStore {
  ticket: {
    match: string;
    gate: string;
    section: string;
    row: string;
    seat: string;
  };
  sustainability: SustainabilityStats;
  chatHistory: Message[];
  addMessage: (msg: Message) => void;
  updateSustainability: (update: Partial<SustainabilityStats>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  ticket: {
    match: 'Mexico City vs Toronto',
    gate: 'Gate A',
    section: '114',
    row: 'J',
    seat: '12',
  },
  sustainability: {
    bottlesSaved: 2,
    carbonSaved: 1.4,
    stepsTaken: 4500,
    points: 120,
  },
  chatHistory: [
    {
      id: '1',
      role: 'assistant',
      content:
        'Welcome to PULSEPATH. I am your match-day assistant. How can I help you navigate the stadium today?',
      timestamp: new Date().toISOString(),
    },
  ],
  addMessage: (msg) => set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
  updateSustainability: (update) =>
    set((s) => ({
      sustainability: { ...s.sustainability, ...update },
    })),
}));
