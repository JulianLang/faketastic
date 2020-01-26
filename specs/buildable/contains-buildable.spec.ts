import { containsBuildableProperty, createBuildable } from '../../src/buildable';
import { createValueFn } from '../../src/value-fns';

describe('containsBuildable', () => {
  it('should return false for static values', () => {
    // arrange, act, assert
    expect(containsBuildableProperty({})).toBe(false);
    expect(containsBuildableProperty({ a: 0, b: false, c: '', d: () => {}, e: {} })).toBe(false);
    expect(containsBuildableProperty([])).toBe(false);
    expect(containsBuildableProperty([0, '', false, () => {}, {}])).toBe(false);
    expect(containsBuildableProperty(0)).toBe(false);
    expect(containsBuildableProperty(false)).toBe(false);
    expect(containsBuildableProperty('')).toBe(false);
    expect(containsBuildableProperty(() => false)).toBe(false);
    expect(containsBuildableProperty(null)).toBe(false);
    expect(containsBuildableProperty(undefined)).toBe(false);
  });

  it('should return true for buildables', () => {
    // arrange
    const buildable = createBuildable(null);

    // act, assert
    expect(containsBuildableProperty(buildable)).toBe(true);
    expect(containsBuildableProperty([buildable])).toBe(true);
    expect(containsBuildableProperty([[buildable]])).toBe(true);
    expect(containsBuildableProperty({ a: buildable })).toBe(true);
    expect(containsBuildableProperty({ a: { before: '', nested: buildable, behind: 0 } })).toBe(
      true,
    );
  });

  it('should return true for value functions', () => {
    // arrange
    const valueFn = createValueFn(() => 0);

    // act, assert
    expect(containsBuildableProperty(valueFn)).toBe(true);
    expect(containsBuildableProperty([valueFn])).toBe(true);
    expect(containsBuildableProperty([[valueFn]])).toBe(true);
    expect(containsBuildableProperty({ a: valueFn })).toBe(true);
    expect(containsBuildableProperty({ a: { before: '', nested: valueFn, behind: 0 } })).toBe(true);
  });
});
