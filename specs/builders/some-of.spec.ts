import { build } from '../../src';
import { someOf } from '../../src/builders';

describe('someOf builder function', () => {
  it('should return at least "2" and at max "values.length" items', () => {
    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];
      const buildable = someOf(values);

      // act
      const result: number[] = build(buildable);

      // assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.length).toBeLessThanOrEqual(values.length);
    }
  });

  it('should respect the minItems option', () => {
    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];
      const buildable = someOf(values, { minItems: 5 });

      // act
      const result: number[] = build(buildable);

      // assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(5);
      expect(result.length).toBeLessThanOrEqual(values.length);
    }
  });

  it('should respect the maxItems option', () => {
    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];
      // since "minItems" is also 2 per default, result will always have 2 items:
      const buildable = someOf(values, { maxItems: 2 });

      // act
      const result: number[] = build(buildable);

      // assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(2);
    }
  });

  it('should respect the given ranges in options', () => {
    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];
      const buildable = someOf(values, { minItems: 3, maxItems: 4 });

      // act
      const result: number[] = build(buildable);

      // assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(result.length).toBeLessThanOrEqual(4);
    }
  });

  it('should respect allowDuplicates option', () => {
    for (let i = 0; i < 10; i++) {
      // arrange
      const values = [1, 2, 3];
      const buildable = someOf(values, { allowDuplicates: false, minItems: 3 });

      // act
      const result: number[] = build(buildable);

      // assert
      const sortedResult = result.sort();
      expect(sortedResult).toEqual([1, 2, 3]);
    }
  });

  it('should have diversity in item counts', () => {
    let lastResultLength = -1;
    let didResultLengthVary = false;

    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];
      const buildable = someOf(values);

      // act
      const result: number[] = build(buildable);

      if (!didResultLengthVary && result.length !== lastResultLength) {
        didResultLengthVary = true;
      }
    }

    // assert
    expect(didResultLengthVary).toBe(true);
  });
});
