import { map } from '../../../src/attached-fns';

describe('map', () => {
  it('should call the mapper function', () => {
    // arrange
    const mapFn = jasmine.createSpy('mapFn');
    const anyValue = 0;

    // act
    map(mapFn)(anyValue);

    // assert
    expect(mapFn).toHaveBeenCalledTimes(1);
    expect(mapFn).toHaveBeenCalledWith(anyValue);
  });

  it('should return the mapped value', () => {
    // arrange
    const original = 0;
    const expectedValue = 42;
    const mapFn = () => expectedValue;

    // act
    const result = map(mapFn)(original);

    // assert
    expect(result).toBe(expectedValue);
  });
});
