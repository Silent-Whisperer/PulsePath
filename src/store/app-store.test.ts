import { describe, test, expect, beforeEach } from 'vitest';
import { useAppStore } from './app-store';

describe('useAppStore state management', () => {
  beforeEach(() => {
    useAppStore.setState({
      role: 'fan',
      language: 'en',
      isHighContrast: false,
      isReducedMotion: false,
      isQuietRoutePreferred: false,
      fontSize: 'normal',
    });
  });

  test('should initialize with correct default values', () => {
    const state = useAppStore.getState();
    expect(state.role).toBe('fan');
    expect(state.isHighContrast).toBe(false);
    expect(state.isQuietRoutePreferred).toBe(false);
  });

  test('toggleHighContrast should change contrast state', () => {
    const { toggleHighContrast } = useAppStore.getState();
    toggleHighContrast();
    expect(useAppStore.getState().isHighContrast).toBe(true);
  });

  test('toggleQuietRoutePreferred should change quiet routing preference', () => {
    const { toggleQuietRoutePreferred } = useAppStore.getState();
    toggleQuietRoutePreferred();
    expect(useAppStore.getState().isQuietRoutePreferred).toBe(true);
  });

  test('setFontSize should update correctly', () => {
    const { setFontSize } = useAppStore.getState();
    setFontSize('large');
    expect(useAppStore.getState().fontSize).toBe('large');
  });
});
