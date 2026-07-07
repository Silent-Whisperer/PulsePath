/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Message } from '../../types';

export async function askPulse(prompt: string, role: string, language: string, context?: any): Promise<string> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, role, language, context }),
    });

    if (!response.ok) {
      throw new Error('AI request failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.warn('AI API failed, falling back to mock response', error);
    const pulsePrompt = `${prompt}. Important: Use only rounded numbers (no long decimals like 14.800000000000002). Keep it concise and professional.`;
    return getMockResponse(pulsePrompt, role, language);
  }
}

function getMockResponse(prompt: string, role: string, language: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('gate')) {
    return "Gate C is currently 41% less congested than Gate A. Take the east concourse route through Zone 3. Estimated arrival: 8 minutes. This route is step-free and avoids the highest-density corridor.";
  }
  
  if (lowerPrompt.includes('food') || lowerPrompt.includes('vegetarian')) {
    return "There are 3 vegetarian-friendly vendors in your current zone. Azteca Tacos (Zone 1) has the shortest queue (15 mins) and uses 100% compostable packaging.";
  }

  if (lowerPrompt.includes('restroom')) {
    return "The nearest low-density restroom is located behind Section 114, about a 2-minute walk from your current location.";
  }

  if (role === 'operations') {
    return "Zone 4 is trending toward critical density within 12 minutes due to a delayed shuttle arrival and gate imbalance. Redirecting 15% of arrivals to Gate D is predicted to reduce congestion by 23%. Recommend deploying two volunteers near the east concourse.";
  }

  return "I'm Pulse, your stadium assistant. I can help you with navigation, queue times, and match information. What would you like to know?";
}
