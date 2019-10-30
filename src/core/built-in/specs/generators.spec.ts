import { probability, random, randomInt } from '../generators';

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

  describe('generators: probability(n)', () => {
    it('should return a boolean', () => {
      // arrange
      // act
      const value = probability(0.5);

      // assert
      expect(typeof value).toEqual('boolean');
    });

    it('should respect the probability factor n', () => {
      // arrange
      const toleratedDeviation = 0.25;
      const testCycles = 1000;
      const probFactor = 0.5; // 50% likely to be true
      const toleratedMin = probFactor - toleratedDeviation;
      const toleratedMax = probFactor + toleratedDeviation;

      let positiveResults = 0;

      for (let i = 0; i < testCycles; i++) {
        // act
        const value = probability(probFactor);

        if (value === true) {
          positiveResults++;
        }
      }

      // assert
      const average = positiveResults / testCycles;
      expect(average).toBeGreaterThan(toleratedMin);
      expect(average).toBeLessThan(toleratedMax);
    });
  });
});
