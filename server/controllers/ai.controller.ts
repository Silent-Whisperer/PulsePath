/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { detectPromptInjection } from '../utils/prompt-detector';
import { getMockResponse } from '../services/mock-ai.service';
import { aiRequestSchema } from '../schemas/ai.schema';

interface ContextGate {
  name: string;
  waitTime: number;
  status: string;
}

interface ContextZone {
  name: string;
  density: number;
  risk: string;
}

interface ContextTransit {
  name: string;
  status: string;
  delay?: string;
  frequency?: number;
}

interface ContextIncident {
  title: string;
  description: string;
  severity: string;
}

/**
 * Handles POST requests to /api/ai
 */
export async function handleAIRequest(req: Request, res: Response): Promise<Response> {
  const result = aiRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { prompt, role, language, context } = result.data;

  // Prompt injection mitigation
  if (detectPromptInjection(prompt)) {
    return res
      .status(400)
      .json({ error: 'Security validation failed: Prohibited instruction pattern detected.' });
  }

  const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;
  const apiKey = isTest ? undefined : process.env.OPENROUTER_API_KEY;

  try {
    if (!apiKey) {
      // Fallback for local testing or if key is not configured
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const text = getMockResponse(prompt, role, language);
      return res.json({ text });
    }

    let gatesContext = `
- Gates Status:
  * Gate A (North): open, queue time: 12 minutes, accessibility: ramps, elevators, braille-signs
  * Gate B (East): restricted, queue time: 35 minutes, accessibility: ramps
  * Gate C (South): open, queue time: 5 minutes (currently 41% less congested than Gate A), accessibility: elevators, hearing-loops
  * Gate D (West): open, queue time: 10 minutes, accessibility: ramps, elevators`;

    let foodContext = `
- Food & Merch Vendors:
  * Azteca Tacos (Zone 1): queue time: 15 minutes, specialty: Tacos/Sodas, 100% compostable packaging, vegetarian-friendly, accessible
  * World Burger: queue time: 8 minutes, specialty: Burgers/Fries, accessible
  * Official Merch Shop: queue time: 20 minutes, specialty: Jerseys/Scarves, sustainable, accessible`;

    let transitContext = `
- Transit Routes:
  * Stadium Express (Blue Metro Line 1): on-time, frequency: 3 mins, load factor: 85%
  * Fan Park Shuttle: delayed, frequency: 10 mins, load factor: 40%`;

    let densityContext = `
- Crowd Density Zones:
  * North Lower Concourse: low risk, 45% capacity
  * East Upper Deck: high risk, 82% capacity
  * West VIP Lounge: low risk, 30% capacity
  * South Fan Zone: medium risk, 65% capacity`;

    let activeIncidentsContext = '';

    if (context) {
      if (context.gates && Array.isArray(context.gates)) {
        gatesContext =
          '\n- Gates Status (Real-time):\n' +
          context.gates
            .map(
              (g: ContextGate) =>
                `  * ${g.name}: wait time: ${g.waitTime} mins, status: ${g.status}`
            )
            .join('\n');
      }
      if (context.zones && Array.isArray(context.zones)) {
        densityContext =
          '\n- Crowd Density Zones (Real-time):\n' +
          context.zones
            .map(
              (z: ContextZone) =>
                `  * ${z.name}: density: ${Math.round(z.density * 100)}%, risk level: ${z.risk}`
            )
            .join('\n');
      }
      if (context.transit && Array.isArray(context.transit)) {
        transitContext =
          '\n- Transit Routes (Real-time):\n' +
          context.transit
            .map(
              (t: ContextTransit) =>
                `  * ${t.name}: status: ${t.status}, delay/frequency: ${t.delay || t.frequency}`
            )
            .join('\n');
      }
      if (context.incidents && Array.isArray(context.incidents) && context.incidents.length > 0) {
        activeIncidentsContext =
          '\n- Active Incidents & Alerts (Real-time):\n' +
          context.incidents
            .map(
              (i: ContextIncident) => `  * ${i.title}: ${i.description} (Severity: ${i.severity})`
            )
            .join('\n');
      }
    }

    const systemPrompt = `You are Pulse, an intelligent real-time AI stadium assistant for Pulse Path, a smart stadium management and navigation platform.
Your response must be tailored to the user's role (${role}) and language (${language}). Always reply in the requested language.

Stadium Current Context:${gatesContext}${foodContext}${transitContext}${densityContext}${activeIncidentsContext}

Behavioral Instructions:
1. Provide highly context-aware guidance matching the user's role (${role}) and query.
2. If role is 'operations', act as an operations coordinator and provide professional, actionable crowd management/redirection advice.
3. Keep the response professional, friendly, clear, and highly focused on the stadium situation.
4. Reply directly in the target language (e.g. if language is 'es', reply in Spanish; if 'fr', reply in French; if 'hi', reply in Hindi; if 'ar', reply in Arabic).`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://pulsepath.com',
        'X-Title': 'Pulse Path',
      },
      body: JSON.stringify({
        model: 'google/gemma-3n-e4b-it',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!openRouterResponse.ok) {
      const errText = await openRouterResponse.text();
      throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errText}`);
    }

    const data = (await openRouterResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content || '';

    if (!text) {
      throw new Error('Received empty response from OpenRouter API');
    }

    return res.json({ text });
  } catch (error: unknown) {
    console.error('AI generation error:', error);
    // Fallback to mock response to ensure system resilience if OpenRouter fails
    try {
      const text = getMockResponse(prompt, role, language);
      return res.json({ text });
    } catch {
      return res.status(500).json({ error: 'Failed to generate response' });
    }
  }
}
