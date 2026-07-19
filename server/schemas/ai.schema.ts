/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt exceeds maximum length of 1000 characters'),
  role: z.enum(['fan', 'operations', 'volunteer', 'accessibility']).optional().default('fan'),
  language: z.enum(['en', 'es', 'fr', 'hi', 'ar']).optional().default('en'),
});

export const aiResponseSchema = z.object({
  text: z.string(),
});

export type AIRequest = z.infer<typeof aiRequestSchema>;
export type AIResponse = z.infer<typeof aiResponseSchema>;
