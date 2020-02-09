import { oneOf } from '../../src/property-fns';

describe('oneOf', () => {
  it('should return one of the given items', () => {
    // arrange
    const values = [42];

    // act
    const result = oneOf(values).value();

    // assert
    expect(result).toEqual(values[0]);
  });
});
