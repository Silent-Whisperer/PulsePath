/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks a string prompt for common prompt injection patterns.
 * Normalize text: remove special characters, collapse spacing.
 * @param text The input prompt to inspect.
 */
export function detectPromptInjection(text: string): boolean {
  if (!text) return false;
  const lowercase = text.toLowerCase();

  const normalized = lowercase
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const injectionPatterns = [
    'ignore previous instructions',
    'ignore all previous',
    'system override',
    'developer mode',
    'you are now a',
    'new instruction',
    'bypass restrictions',
    'do not mention',
    'jailbreak',
    'pretend to be',
    'dan mode',
    'rule override',
    'forget your instructions',
    'forget everything',
  ];
  return injectionPatterns.some(
    (pattern) => normalized.includes(pattern) || lowercase.includes(pattern)
  );
}
