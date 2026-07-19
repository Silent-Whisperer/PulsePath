/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { detectPromptInjection } from '../utils/prompt-detector';
import { getMockResponse } from '../services/mock-ai.service';
import { aiRequestSchema } from '../schemas/ai.schema';

/**
 * Handles POST requests to /api/ai
 */
export async function handleAIRequest(req: Request, res: Response): Promise<Response> {
  const result = aiRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const { prompt, role, language } = result.data;

  // Prompt injection mitigation
  if (detectPromptInjection(prompt)) {
    return res
      .status(400)
      .json({ error: 'Security validation failed: Prohibited instruction pattern detected.' });
  }

  try {
    // Fake loading delay to simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const text = getMockResponse(prompt, role, language);
    return res.json({ text });
  } catch (error: unknown) {
    console.error('AI generation error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
