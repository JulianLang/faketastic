import { oneOf } from '../../src/builders';
import { build, template } from '../../src/core';
import { includeDirectiveFnSpecs } from '../spec-helpers/shared-specs';

describe('oneOf BuilderFn', () => {
  it('should throw for null at building-time', () => {
    // arrange
    const buildable = oneOf(null as any);

    // act
    // assert
    expect(() => build(buildable)).toThrow();
  });

  it('should throw for undefined at building-time', () => {
    // arrange
    const buildable = oneOf(undefined as any);

    // act
    // assert
    expect(() => build(buildable)).toThrow();
  });

  it('should return undefined for empty array as input', () => {
    // arrange
    const buildable = oneOf([]);

    // act
    const result = build(buildable);

    // assert
    expect(result).toBe(undefined);
  });

  fit('should be nestable', () => {
    // arrange
    const tmpl = template({
      a: oneOf([oneOf([42]), oneOf(['A'])]),
    });

    // act
    const result = build(tmpl);

    // assert
    expect(result.a === 'A' || result.a === 42).toBe(true);
  });

  it('should be directly buildable', () => {
    // arrange
    // act
    const result = build(oneOf([42]));

    // assert
    expect(result).toBe(42);
  });

  includeDirectiveFnSpecs(oneOf, []);
});
