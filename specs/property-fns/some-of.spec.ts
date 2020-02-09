import { createArchitectFn } from '../../src/attached-fns';
import { someOf } from '../../src/property-fns';

describe('someOf', () => {
  it('should sort parameters correctly by types (any | AttachedFn)', () => {
    // arrange
    const attachedFn = createArchitectFn(() => {});

    // act
    const buildable = someOf([0], attachedFn);

    // assert
    expect(buildable.attachedFns).toEqual([attachedFn]);
  });

  it('should return at least "2" and at max "values.length" items', () => {
    // arrange
    const values = [1, 2, 3, 4, 5, 6];

    // act
    const result: number[] = someOf(values).value();

    // assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.length).toBeLessThanOrEqual(values.length);
  });

  it('should respect the minItems option', () => {
    // arrange
    const values = [1, 2, 3, 4, 5, 6];

    // act
    const result: number[] = someOf(values, { minItems: 5 }).value();

    // assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.length).toBeLessThanOrEqual(values.length);
  });

  it('should respect the maxItems option', () => {
    // arrange
    const values = [1, 2, 3, 4, 5, 6];

    // act
    const result: number[] = someOf(values, { maxItems: 2 }).value();

    // assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('should respect allowDuplicates option', () => {
    // arrange
    const values = [1, 2, 3];

    // act
    const result: number[] = someOf(values, {
      minItems: 3,
      maxItems: 3,
      allowDuplicates: false,
    }).value();

    // assert
    const sortedResult = result.sort();
    expect(sortedResult).toEqual([1, 2, 3]);
  });

  it('should have diversity in item counts', () => {
    let lastResultLength = -1;
    let didResultLengthVary = false;

    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];

      // act
      const result: number[] = someOf(values).value();

      if (!didResultLengthVary && result.length !== lastResultLength) {
        didResultLengthVary = true;
      }
    }

    // assert
    expect(didResultLengthVary).toBe(true);
  });

  it('should throw for empty arrays', () => {
    // arrange
    const illegalConfig = someOf([]);

    // act, assert
    expect(() => illegalConfig.value()).toThrowMatching((err: Error) =>
      err.message.includes('empty'),
    );
  });

  it('should throw when minItems > values.length and no duplicates are allowed', () => {
    // arrange
    const illegalConfig = someOf([1], { minItems: 2, maxItems: 2, allowDuplicates: false });

    // act, assert
    expect(() => illegalConfig.value()).toThrowMatching((err: Error) =>
      err.message.includes('impossible'),
    );
  });

  it('should throw when min is negative', () => {
    // arrange
    const illegalConfig = someOf([1], { minItems: -2 });

    // act, assert
    expect(() => illegalConfig.value()).toThrowMatching((err: Error) =>
      err.message.includes('negative'),
    );
  });

  it('should throw when max is negative', () => {
    // arrange
    const illegalConfig = someOf([1], { maxItems: -2 });

    // act, assert
    expect(() => illegalConfig.value()).toThrowMatching((err: Error) =>
      err.message.includes('negative'),
    );
  });

  it('should throw when min > max', () => {
    // arrange
    const illegalConfig = someOf([1], { minItems: 2, maxItems: 1 });

    // act, assert
    expect(() => illegalConfig.value()).toThrowMatching((err: Error) =>
      err.message.includes('impossible'),
    );
  });
});
