import { random } from '../../../src/core/randomizers/random.randomizer';

describe('random', () => {
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
    const max = 10;

    for (let i = 0; i < testCycles; i++) {
      // act
      const value = random(min, max);

      // assert
      expect(value).toBeLessThan(max + 0.1);
      expect(value).toBeGreaterThan(min - 0.1);
    }
  });

  it('should return min if the random result is smaller than min', () => {
    // arrange
    const randomSpy = spyOn(Math, 'random').and.callFake(() => -10);
    const min = 1;
    const max = 2;

    // act
    const value = random(min, max);

    // assert
    expect(randomSpy).toHaveBeenCalledTimes(1);
    expect(value).toBe(min);
  });

  it('should return max if the random result is greater than max', () => {
    // arrange
    const randomSpy = spyOn(Math, 'random').and.callFake(() => 10);
    const min = 1;
    const max = 2;

    // act
    const value = random(min, max);

    // assert
    expect(randomSpy).toHaveBeenCalledTimes(1);
    expect(value).toBe(max);
  });
});
