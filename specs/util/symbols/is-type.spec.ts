import { Type } from '../../../src/constants';
import { is } from '../../../src/util';

describe('is', () => {
  it('should return true if the type matches', () => {
    // arrange
    const expectedType = 'test-type';
    const value = { [Type]: expectedType };

    // act
    const result = is(value, expectedType);

    // assert
    expect(result).toBe(true);
  });

  it('should return false if the type does not match', () => {
    // arrange
    const expectedType = 'test-type';
    const value = { [Type]: 'other-type' };

    // act
    const result = is(value, expectedType);

    // assert
    expect(result).toBe(false);
  });

  it('should return false if the value does not have a type-identifier', () => {
    // arrange
    const expectedType = 'test-type';
    const value = {};

    // act
    const result = is(value, expectedType);

    // assert
    expect(result).toBe(false);
  });

  it('should return false if the value is null or undefined', () => {
    // arrange, act, assert
    expect(is(null, 'type-id')).toBe(false);
    expect(is(undefined, 'type-id')).toBe(false);
  });
});
