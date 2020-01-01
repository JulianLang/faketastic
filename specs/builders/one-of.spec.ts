import { oneOf } from '../../src/builders';
import { build, model } from '../../src/core';
import { includeBuilderFnSpecs, includeDirectiveFnSpecs, transferAttachedFnsSpecs } from '../spec-helpers/shared-specs';

describe('oneOf', () => {
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

  it('should be nestable', () => {
    // arrange
    const mdl = model({
      a: oneOf([oneOf([42]), oneOf(['A'])]),
    });

    // act
    const result = build(mdl);

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

  transferAttachedFnsSpecs(oneOf);
  includeDirectiveFnSpecs(oneOf, []);
  includeBuilderFnSpecs(oneOf, []);
});
