/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { detectPromptInjection } from '../utils/prompt-detector';
import { getMockResponse } from '../services/mock-ai.service';

/**
 * Handles POST requests to /api/ai
 */
export async function handleAIRequest(req: Request, res: Response): Promise<any> {
  const { prompt, role, language } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt parameter' });
  }

  // DOS mitigation: length limit validation
  if (prompt.length > 1000) {
    return res.status(400).json({ error: 'Prompt exceeds maximum length of 1000 characters' });
  }

  // Prompt injection mitigation
  if (detectPromptInjection(prompt)) {
    return res
      .status(400)
      .json({ error: 'Security validation failed: Prohibited instruction pattern detected.' });
  }

  try {
    // Fake loading delay to simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const text = getMockResponse(prompt, role || 'fan', language || 'en');
    return res.json({ text });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
