import { randomItems } from '../../src/value-fns/random-items-value.fn';

describe('randomItems', () => {
  it('should return at least "2" and at max "values.length" items', () => {
    // arrange
    const values = [1, 2, 3, 4, 5, 6];

    // act
    const result: number[] = randomItems(values);

    // assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.length).toBeLessThanOrEqual(values.length);
  });

  it('should respect the minItems option', () => {
    // arrange
    const values = [1, 2, 3, 4, 5, 6];

    // act
    const result: number[] = randomItems(values, 5);

    // assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.length).toBeLessThanOrEqual(values.length);
  });

  it('should respect the maxItems option', () => {
    // arrange
    const values = [1, 2, 3, 4, 5, 6];

    // act
    const result: number[] = randomItems(values, 2, 2);

    // assert
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('should respect allowDuplicates option', () => {
    // arrange
    const values = [1, 2, 3];

    // act
    const result: number[] = randomItems(values, 3, 3, false);

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
      const result: number[] = randomItems(values);

      if (!didResultLengthVary && result.length !== lastResultLength) {
        didResultLengthVary = true;
      }
    }

    // assert
    expect(didResultLengthVary).toBe(true);
  });

  it('should throw for empty arrays', () => {
    // arrange
    expect(() => randomItems([])).toThrowMatching((err: Error) => err.message.includes('empty'));
  });

  it('should throw when minItems > values.length and no duplicates are allowed', () => {
    // arrange
    expect(() => randomItems([1], 2, 2, false)).toThrowMatching((err: Error) =>
      err.message.includes('impossible'),
    );
  });

  it('should throw when min is negative', () => {
    // arrange
    expect(() => randomItems([1], -2, 2, false)).toThrowMatching((err: Error) =>
      err.message.includes('negative'),
    );
  });

  it('should throw when max is negative', () => {
    // arrange
    expect(() => randomItems([1], 2, -2, false)).toThrowMatching((err: Error) =>
      err.message.includes('negative'),
    );
  });

  it('should throw when min > max', () => {
    // arrange
    expect(() => randomItems([1], 2, 1, false)).toThrowMatching((err: Error) =>
      err.message.includes('impossible'),
    );
  });
});
