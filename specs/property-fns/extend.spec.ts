import { isBuildable } from '../../src/buildable';
import { extend } from '../../src/property-fns/extend';

describe('extend', () => {
  const base = { a: 42 };
  const extension = { b: 0 };

  it('should return a buildable', () => {
    // arrange, act
    const result = extend(base, {});

    // assert
    expect(isBuildable(result)).toBe(true);
  });

  it('should clone of the specified model inputs', () => {
    // arrange, act
    const result = extend(base, extension);

    // assert
    expect(result.value).not.toBe(base as any);
    expect(result.value).not.toBe(extension as any);
  });

  it('should merge both models', () => {
    // arrange, act
    const result = extend(base, extension);

    // assert
    expect(result.value).toEqual({
      ...base,
      ...extension,
    });
  });

  it('should let the extension override base-model properties', () => {
    // arrange, act
    const overridingValue = 4711;
    const result = extend(base, { a: overridingValue });

    // assert
    expect(result.value).toEqual({ a: overridingValue });
  });
});
