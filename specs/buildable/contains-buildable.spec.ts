import { containsBuildable, createBuildable } from '../../src/buildable';

describe('containsBuildable', () => {
  const buildable = createBuildable(null);

  it('should return false for static values', () => {
    // arrange, act, assert
    expect(containsBuildable({})).toBe(false);
    expect(containsBuildable({ a: 12, b: true, c: 'str', d: () => {}, e: {} })).toBe(false);
    expect(containsBuildable([])).toBe(false);
    expect(containsBuildable([1, 'str', true, () => {}, {}])).toBe(false);
    expect(containsBuildable(42)).toBe(false);
    expect(containsBuildable(false)).toBe(false);
    expect(containsBuildable('static')).toBe(false);
    expect(containsBuildable(() => true)).toBe(false);
  });

  it('should return true for buildables', () => {
    // arrange, act, assert
    expect(containsBuildable(buildable)).toBe(true);
    expect(containsBuildable([buildable])).toBe(true);
    expect(containsBuildable([[buildable]])).toBe(true);
    expect(containsBuildable({ a: buildable })).toBe(true);
    expect(containsBuildable({ a: { nested: buildable } })).toBe(true);
  });
});
