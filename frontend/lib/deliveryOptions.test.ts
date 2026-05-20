import { describe, expect, it } from 'vitest';
import { DELIVERY_OPTIONS, deliveryDays, deliveryOptionsUpTo } from './deliveryOptions';

describe('deliveryDays', () => {
  it('returns the day count for known durations', () => {
    expect(deliveryDays('1 week')).toBe(7);
    expect(deliveryDays('2 weeks')).toBe(14);
    expect(deliveryDays('3 months')).toBe(90);
  });

  it('returns 0 for unknown durations', () => {
    expect(deliveryDays('1 century')).toBe(0);
    expect(deliveryDays('')).toBe(0);
  });
});

describe('deliveryOptionsUpTo', () => {
  it('returns only options at or below the cap', () => {
    const result = deliveryOptionsUpTo('2 weeks');
    expect(result.map((o) => o.value)).toEqual(['1 week', '2 weeks']);
  });

  it('returns the full list for the longest duration', () => {
    const result = deliveryOptionsUpTo('3 months');
    expect(result).toHaveLength(DELIVERY_OPTIONS.length);
  });

  it('returns all options when the cap is unknown (safe default)', () => {
    const result = deliveryOptionsUpTo('not a real duration');
    expect(result).toHaveLength(DELIVERY_OPTIONS.length);
  });
});
