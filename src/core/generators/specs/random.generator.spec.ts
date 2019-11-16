import { random } from '../random.generator';

describe('generators: random(min, max)', () => {
  it('should return a number', () => {
    // arrange
    // act
    const value = random(1, 1);

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
      const value = random(min, max);

      // assert
      expect(value).toBeLessThan(max + 0.1);
      expect(value).toBeGreaterThan(min - 0.1);
    }
  });
});
