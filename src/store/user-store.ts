/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { SustainabilityStats, Message } from '../types';

interface UserStore {
  venueId: string;
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
  setVenue: (venueId: string) => void;
  setTicket: (ticket: Partial<UserStore['ticket']>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  venueId: 'estadio-azteca',
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
  setVenue: (venueId) => set({ venueId }),
  setTicket: (ticket) => set((s) => ({ ticket: { ...s.ticket, ...ticket } })),
}));
