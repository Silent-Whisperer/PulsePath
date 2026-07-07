import { describe, test, expect, beforeEach } from 'vitest';
import { useUserStore } from './user-store';

describe('useUserStore state management', () => {
  beforeEach(() => {
    // Reset state before each test
    useUserStore.setState({
      sustainability: {
        bottlesSaved: 2,
        carbonSaved: 1.4,
        stepsTaken: 4500,
        points: 120
      },
      chatHistory: []
    });
  });

  test('should initialize with correct default ticket details', () => {
    const state = useUserStore.getState();
    expect(state.ticket.match).toBe('Mexico City vs Toronto');
    expect(state.ticket.gate).toBe('Gate A');
  });

  test('updateSustainability updates sustainability parameters correctly', () => {
    const { updateSustainability } = useUserStore.getState();
    
    updateSustainability({
      points: 150,
      bottlesSaved: 3
    });

    const state = useUserStore.getState();
    expect(state.sustainability.points).toBe(150);
    expect(state.sustainability.bottlesSaved).toBe(3);
    expect(state.sustainability.carbonSaved).toBe(1.4); // unchanged
  });

  test('addMessage appends messages to chat history', () => {
    const { addMessage } = useUserStore.getState();
    const msg = {
      id: 'test-msg-1',
      role: 'user' as const,
      content: 'Where is Section 114?',
      timestamp: new Date().toISOString()
    };

    addMessage(msg);

    const state = useUserStore.getState();
    expect(state.chatHistory).toHaveLength(1);
    expect(state.chatHistory[0].content).toBe('Where is Section 114?');
  });
});
