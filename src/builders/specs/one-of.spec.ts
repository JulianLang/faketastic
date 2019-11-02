import { build } from '../../core';
import { includeBuilderFnSpecs } from '../../core/built-in/specs/shared/shared-specs';
import { oneOf } from '../one-of';

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

  // it('should return instantly when only Buildables are passed', () => {
  //   // arrange
  //   const tmpl = createBuildable({});

  //   // act
  //   const buildable = oneOf([tmpl]);

  //   // assert
  //   expect(buildable).toBe(tmpl);
  // });

  // it('should not return instantly when both, Buildables and values are passed', () => {
  //   // arrange
  //   const tmpl = createBuildable({});

  //   // act
  //   const buildable = oneOf([tmpl, 12]);

  //   // assert
  //   expect(buildable).not.toBe(tmpl);
  // });

  includeBuilderFnSpecs(oneOf, []);
});
