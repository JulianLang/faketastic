import { probability } from '../../src/core/generators/probability.generator';

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
