import { randomIndex } from '../../src/core/randomizers/random-index.randomizer';

describe('randomIndex', () => {
  it('should throw for null and undefined', () => {
    // arrange
    const nullInput = null;
    const undefinedInput = undefined;

    // act
    // assert
    expect(() => randomIndex(nullInput as any)).toThrow();
    expect(() => randomIndex(undefinedInput as any)).toThrow();
  });

  it('should return 0 for an empty array', () => {
    // arrange
    const array: any[] = [];

    // act
    const index = randomIndex(array);

    // assert
    expect(index).toBe(0);
    expect(() => array[index]).not.toThrow();
  });

  it('should return a valid index for array', () => {
    // arrange
    const array = ['a', 'b', 'c'];

    // act
    const index = randomIndex(array);

    // assert
    expect(index).toBeLessThan(array.length);
    expect(index).toBeGreaterThanOrEqual(0);
  });
});
