import { oneOf } from '../../src/builders';
import { build } from '../../src/core';
import { includeBuilderFnSpecs } from '../spec-helpers/shared-specs';

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
    const result = buildable.value();

    // assert
    expect(result).toBe(undefined);
  });

  includeBuilderFnSpecs(oneOf, []);
});
