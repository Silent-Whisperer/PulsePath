import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { askPulse } from './client';

describe('askPulse client utility', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should successfully fetch response from backend /api/ai', async () => {
    const mockResponse = { text: 'Mocked server reply' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await askPulse('gate info', 'fan', 'en');
    expect(fetchMock).toHaveBeenCalledWith('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'gate info',
        role: 'fan',
        language: 'en',
        context: undefined,
      }),
    });
    expect(result).toBe('Mocked server reply');
  });

  test('should fallback to local mock response if fetch fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network failure'));
    vi.stubGlobal('fetch', fetchMock);

    // We pass "gate" as prompt, which should trigger the gate translation fallback in English
    const result = await askPulse('gate', 'fan', 'en');
    expect(result).toContain('Gate C is currently 41% less congested');
  });

  test('should fallback to local mock response if response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Security validation failed' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    // We pass "food" as prompt
    const result = await askPulse('food', 'fan', 'en');
    expect(result).toContain('There are 3 vegetarian-friendly vendors');
  });
});
