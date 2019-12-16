import { build, template } from '../../src';
import { someOf } from '../../src/builders';

describe('someOf', () => {
  it('should return at least 1 and at max "values.length" items', () => {
    for (let i = 0; i < 1000; i++) {
      // arrange
      const values = [1, 2, 3, 4, 5, 6];
      const buildable = someOf(values);

      // act
      const result: number[] = build(buildable);

      // assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThanOrEqual(1);
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

  it('should detect minItems being greater than maxItems', () => {
    // arrange
    const buildable = someOf([1, 2, 3], {
      minItems: 3,
      maxItems: 1,
    });

    // act
    // assert
    expect(() => build(buildable)).toThrow();
  });

  it('should detect empty arrays', () => {
    // arrange
    const buildable = someOf([]);

    // act
    // assert
    expect(() => build(buildable)).toThrow();
  });

  it('should detect options being impossible to meet.', () => {
    // arrange
    const buildable = someOf([1], {
      /*
        This config is impossible to meet, as there is no enough data ([1])
        to generate 2 distinct items from. someOf should detect this and throw.
      */
      minItems: 2,
      allowDuplicates: false,
    });

    // act
    // assert
    expect(() => build(buildable)).toThrow();
  });

  it('should be nestable', () => {
    // arrange
    const tmpl = template({
      a: someOf([someOf(['A'], { maxItems: 1 })], { maxItems: 1 }),
    });

    // act
    const result = build(tmpl);

    // assert
    expect(result.a).toEqual([['A']]);
  });

  it('should be directly buildable', () => {
    // arrange
    // act
    const result = build(someOf([42], { maxItems: 1 }));

    // assert
    expect(result).toEqual([42]);
  });
});
