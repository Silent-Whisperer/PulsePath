/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { UserRole, Language } from '../types';

interface AppState {
  role: UserRole;
  language: Language;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isQuietRoutePreferred: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleQuietRoutePreferred: () => void;
  setFontSize: (size: AppState['fontSize']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'fan',
  language: 'en',
  isHighContrast: false,
  isReducedMotion: false,
  isQuietRoutePreferred: false,
  fontSize: 'normal',
  setRole: (role) => set({ role }),
  setLanguage: (language) => set({ language }),
  toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
  toggleReducedMotion: () => set((state) => ({ isReducedMotion: !state.isReducedMotion })),
  toggleQuietRoutePreferred: () => set((state) => ({ isQuietRoutePreferred: !state.isQuietRoutePreferred })),
  setFontSize: (fontSize) => set({ fontSize }),
}));
