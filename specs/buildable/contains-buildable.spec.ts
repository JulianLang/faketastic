import { containsBuildable, createBuildable } from '../../src/buildable';

describe('containsBuildable', () => {
  const buildable = createBuildable(null);

  it('should return false for static values', () => {
    // arrange, act, assert
    expect(containsBuildable({})).toBe(false);
    expect(containsBuildable({ a: 0, b: false, c: '', d: () => {}, e: {} })).toBe(false);
    expect(containsBuildable([])).toBe(false);
    expect(containsBuildable([0, '', false, () => {}, {}])).toBe(false);
    expect(containsBuildable(0)).toBe(false);
    expect(containsBuildable(false)).toBe(false);
    expect(containsBuildable('')).toBe(false);
    expect(containsBuildable(() => false)).toBe(false);
    expect(containsBuildable(null)).toBe(false);
    expect(containsBuildable(undefined)).toBe(false);
  });

  it('should return true for buildables', () => {
    // arrange, act, assert
    expect(containsBuildable(buildable)).toBe(true);
    expect(containsBuildable([buildable])).toBe(true);
    expect(containsBuildable([[buildable]])).toBe(true);
    expect(containsBuildable({ a: buildable })).toBe(true);
    expect(containsBuildable({ a: { before: '', nested: buildable, behind: 0 } })).toBe(true);
  });
});
