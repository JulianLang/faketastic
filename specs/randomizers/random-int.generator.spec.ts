import { randomInt } from '../../src/core/randomizers/random-int.generator';

describe('generators: randomInt(min, max)', () => {
  it('should return a number', () => {
    // arrange
    // act
    const value = randomInt(1, 1);

    // assert
    expect(typeof value).toEqual('number');
  });

  it('should always return values in range', () => {
    // arrange
    const testCycles = 1000;
    const min = 1;
    const max = 1;

    for (let i = 0; i < testCycles; i++) {
      // act
      const value = randomInt(min, max);

      // assert
      expect(value).toBeLessThan(max + 1);
      expect(value).toBeGreaterThan(min - 1);
    }
  });

  it('should always return integer', () => {
    // arrange
    const min = 1;
    const max = 3;
    const validResults = [1, 2, 3];
    const testCycles = 1000;

    for (let i = 0; i < testCycles; i++) {
      // act
      const value = randomInt(min, max);
      // assert
      expect(validResults.includes(value)).toBe(true);
    }
  });
});
