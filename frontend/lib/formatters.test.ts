import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { formatBudget, formatCurrency, formatDate, formatRelative } from './formatters';

describe('formatCurrency', () => {
  it('formats whole dollars with no decimals', () => {
    expect(formatCurrency(1500)).toBe('$1,500');
  });

  it('rounds fractional cents away', () => {
    expect(formatCurrency(99.49)).toBe('$99');
    expect(formatCurrency(99.5)).toBe('$100');
  });
});

describe('formatBudget', () => {
  it('joins min and max with an en-dash', () => {
    expect(formatBudget(500, 2000)).toBe('$500 – $2,000');
  });
});

describe('formatDate', () => {
  it('returns a localized short date', () => {
    // Use a noon-UTC time to avoid timezone day rollover surprises.
    expect(formatDate('2026-05-20T12:00:00Z')).toBe('May 20, 2026');
  });
});

describe('formatRelative', () => {
  // Pin Date.now() to a known moment so the buckets are deterministic.
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it('says "Today" for same-day timestamps', () => {
    expect(formatRelative('2026-05-20T08:00:00Z')).toBe('Today');
  });

  it('says "Yesterday" for the previous day', () => {
    expect(formatRelative('2026-05-19T08:00:00Z')).toBe('Yesterday');
  });

  it('returns "Nd ago" for under a month', () => {
    expect(formatRelative('2026-05-15T12:00:00Z')).toBe('5d ago');
  });

  it('returns months for under a year', () => {
    expect(formatRelative('2026-02-20T12:00:00Z')).toBe('3mo ago');
  });

  it('returns years for older dates', () => {
    expect(formatRelative('2024-05-20T12:00:00Z')).toBe('2y ago');
  });
});
