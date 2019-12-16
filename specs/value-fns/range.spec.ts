import { range } from '../../src';
import { includeValueFnSpecs } from '../spec-helpers/shared-specs';

describe('range', () => {
  it('should always return values in range', () => {
    // arrange
    const min = 1;
    const max = 1;
    const buildable = range(min, max);

    // test 100 times
    for (let i = 0; i < 100; i++) {
      // act
      const value = buildable.value();

      // assert
      expect(value).toBeLessThan(max + 1);
      expect(value).toBeGreaterThan(min - 1);
    }
  });

  it('should return a number', () => {
    // arrange
    const buildable = range(1, 1);

    // act
    const value = buildable.value();

    // assert
    expect(typeof value).toEqual('number');
  });

  includeValueFnSpecs(range, 1, 2);
});
