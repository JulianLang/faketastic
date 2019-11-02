import { probability, random, randomIndex, randomInt, randomItem } from '../generators';

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
});

describe('generators: randomIndex', () => {
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

describe('generators: randomItem', () => {
  it('should return null for an empty array', () => {
    // arrange
    const array: any[] = [];

    // act
    const item = randomItem(array);

    // assert
    expect(item).toBe(null);
  });

  it('should return an item of a non-empty array', () => {
    // arrange
    const item = 1;
    const array: any[] = [item, item];

    // act
    const chosenItem = randomItem(array);

    // assert
    expect(chosenItem).toBe(item);
  });
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
