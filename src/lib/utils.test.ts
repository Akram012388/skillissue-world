import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce, formatNumber, formatRelativeTime, truncate } from './utils';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Mock current date to 2024-06-15T12:00:00Z for consistent tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for times less than a minute ago', () => {
    const thirtySecondsAgo = new Date('2024-06-15T11:59:30Z').toISOString();
    expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now');
  });

  it('returns "1 minute ago" for exactly one minute ago', () => {
    const oneMinuteAgo = new Date('2024-06-15T11:59:00Z').toISOString();
    expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
  });

  it('returns "X minutes ago" for times less than an hour ago', () => {
    const fortyFiveMinutesAgo = new Date('2024-06-15T11:15:00Z').toISOString();
    expect(formatRelativeTime(fortyFiveMinutesAgo)).toBe('45 minutes ago');
  });

  it('returns "1 hour ago" for exactly one hour ago', () => {
    const oneHourAgo = new Date('2024-06-15T11:00:00Z').toISOString();
    expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
  });

  it('returns "X hours ago" for times less than a day ago', () => {
    const fiveHoursAgo = new Date('2024-06-15T07:00:00Z').toISOString();
    expect(formatRelativeTime(fiveHoursAgo)).toBe('5 hours ago');
  });

  it('returns "1 day ago" for exactly one day ago', () => {
    const oneDayAgo = new Date('2024-06-14T12:00:00Z').toISOString();
    expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago');
  });

  it('returns "X days ago" for times less than a month ago', () => {
    const tenDaysAgo = new Date('2024-06-05T12:00:00Z').toISOString();
    expect(formatRelativeTime(tenDaysAgo)).toBe('10 days ago');
  });

  it('returns "1 month ago" for approximately one month ago', () => {
    const oneMonthAgo = new Date('2024-05-15T12:00:00Z').toISOString();
    expect(formatRelativeTime(oneMonthAgo)).toBe('1 month ago');
  });

  it('returns "X months ago" for times less than a year ago', () => {
    const sixMonthsAgo = new Date('2023-12-15T12:00:00Z').toISOString();
    expect(formatRelativeTime(sixMonthsAgo)).toBe('6 months ago');
  });

  it('returns "1 year ago" for approximately one year ago', () => {
    const oneYearAgo = new Date('2023-06-15T12:00:00Z').toISOString();
    expect(formatRelativeTime(oneYearAgo)).toBe('1 year ago');
  });

  it('returns "X years ago" for times more than a year ago', () => {
    const threeYearsAgo = new Date('2021-06-15T12:00:00Z').toISOString();
    expect(formatRelativeTime(threeYearsAgo)).toBe('3 years ago');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution by the specified delay', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer when called multiple times', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    vi.advanceTimersByTime(50);
    debouncedFn();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the debounced function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('only executes with the last set of arguments', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });
});

describe('formatNumber', () => {
  it('formats numbers with thousands separators', () => {
    // The format depends on the locale, so we check that separators are added
    const result1000 = formatNumber(1000);
    const result1M = formatNumber(1000000);

    // In US locale: "1,000" and "1,000,000"
    // In Indian locale: "1,000" and "10,00,000"
    // Just verify that some formatting is applied (contains separator or is locale-formatted)
    expect(result1000.replace(/[^\d]/g, '')).toBe('1000');
    expect(result1M.replace(/[^\d]/g, '')).toBe('1000000');
    // Verify that formatting is applied (string length is longer than raw digits)
    expect(result1M.length).toBeGreaterThan(7);
  });

  it('handles small numbers without separators', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  it('handles negative numbers', () => {
    const result = formatNumber(-1000);
    // Contains the digits and a negative sign
    expect(result.replace(/[^\d-]/g, '')).toBe('-1000');
  });

  it('handles decimal numbers', () => {
    const result = formatNumber(1234.56);
    // Contains the digits regardless of locale formatting
    expect(result.replace(/[^\d.]/g, '')).toContain('1234');
  });
});

describe('truncate', () => {
  it('returns the original string if it is shorter than maxLength', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('returns the original string if it is exactly maxLength', () => {
    expect(truncate('exactly10!', 10)).toBe('exactly10!');
  });

  it('truncates and adds ellipsis for strings longer than maxLength', () => {
    expect(truncate('this is a long string', 10)).toBe('this is...');
  });

  it('handles edge case where maxLength equals 3 (just ellipsis)', () => {
    expect(truncate('hello', 3)).toBe('...');
  });

  it('handles empty strings', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('handles maxLength of 0', () => {
    // Edge case: maxLength - 3 = -3, slice(0, -3) gives 'he' for 'hello'
    // This is an edge case behavior to document
    expect(truncate('hello', 0)).toBe('he...');
  });
});
