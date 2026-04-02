import { describe, it, expect } from 'vitest';
import { getHeatCount, buildHeats, shuffle } from './heat-algorithm.js';

describe('getHeatCount', () => {
  it('4 surfers → 2 heats (forces minimum of 2)', () => {
    expect(getHeatCount(4)).toBe(2);
  });

  it('9 surfers → 2 heats (4+5)', () => {
    expect(getHeatCount(9)).toBe(2);
  });

  it('8 surfers → 2 heats of 4', () => {
    expect(getHeatCount(8)).toBe(2);
  });

  it('12 surfers → 3 heats of 4', () => {
    expect(getHeatCount(12)).toBe(3);
  });

  it('48 surfers → 12 heats (exactly 240 min)', () => {
    expect(getHeatCount(48)).toBe(12);
  });

  it('52 surfers → 10 heats (size 4 would be 13 heats = 260 min, exceeds limit)', () => {
    expect(getHeatCount(52)).toBe(10);
  });

  it('72 surfers → 12 heats of 6 (max size)', () => {
    expect(getHeatCount(72)).toBe(12);
  });

  it('2 surfers → 1 heat (cannot split into 2 heats of 1)', () => {
    expect(getHeatCount(2)).toBe(1);
  });

  it('3 surfers → 1 heat (splitting into 2 gives avg 1.5, below min size 2)', () => {
    expect(getHeatCount(3)).toBe(1);
  });
});

describe('buildHeats', () => {
  it('preserves total surfer count across all heats', () => {
    const names = Array.from({ length: 13 }, (_, i) => `Surfer ${i + 1}`);
    const heats = buildHeats(names);
    const total = heats.reduce((sum, h) => sum + h.surfers.length, 0);
    expect(total).toBe(13);
  });

  it('every surfer in a heat has a valid vestNumber (1–6)', () => {
    const names = Array.from({ length: 20 }, (_, i) => `Surfer ${i + 1}`);
    const heats = buildHeats(names);
    for (const heat of heats) {
      for (const s of heat.surfers) {
        expect(s.vestNumber).toBeGreaterThanOrEqual(1);
        expect(s.vestNumber).toBeLessThanOrEqual(6);
      }
    }
  });

  it('vest numbers within each heat are sequential starting at 1', () => {
    const names = Array.from({ length: 10 }, (_, i) => `Surfer ${i + 1}`);
    const heats = buildHeats(names);
    for (const heat of heats) {
      heat.surfers.forEach((s, i) => {
        expect(s.vestNumber).toBe(i + 1);
      });
    }
  });

  it('each heat size is between 2 and 6', () => {
    for (const n of [4, 9, 12, 20, 48, 52]) {
      const names = Array.from({ length: n }, (_, i) => `Surfer ${i + 1}`);
      const heats = buildHeats(names);
      for (const heat of heats) {
        expect(heat.surfers.length).toBeGreaterThanOrEqual(2);
        expect(heat.surfers.length).toBeLessThanOrEqual(6);
      }
    }
  });

  it('heat numbers are sequential starting at 1', () => {
    const names = Array.from({ length: 8 }, (_, i) => `Surfer ${i + 1}`);
    const heats = buildHeats(names);
    heats.forEach((h, i) => {
      expect(h.heatNumber).toBe(i + 1);
    });
  });

  it('all input surfer names appear exactly once in output', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'];
    const heats = buildHeats(names);
    const outputNames = heats.flatMap(h => h.surfers.map(s => s.name)).sort();
    expect(outputNames).toEqual([...names].sort());
  });
});

describe('shuffle', () => {
  it('returns a permutation of the input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = shuffle(input);
    expect(result.sort((a, b) => a - b)).toEqual(input);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('returns a new array', () => {
    const input = [1, 2, 3];
    expect(shuffle(input)).not.toBe(input);
  });
});
