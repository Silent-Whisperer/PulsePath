import { describe, test, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  test('should merge standard class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  test('should handle conditional classes', () => {
    expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white');
  });

  test('should resolve tailwind conflicts in favor of the last class', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  test('should handle arrays and object styles', () => {
    expect(cn(['bg-red-500', 'text-white'], { hidden: true, block: false })).toBe('bg-red-500 text-white hidden');
  });
});
