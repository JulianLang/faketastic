import { createProcessorFn, range } from '../../src';
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

  it('should allow the user to skip min and max parameters', () => {
    // arrange
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');

    // act, assert
    expect(() => range(processor)).not.toThrow();
  });

  it('should set min to 1 and max to 10', () => {
    // arrange
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');
    const value = range(processor).value();

    // act, assert
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
  });

  includeValueFnSpecs(range, 1, 2);
});
