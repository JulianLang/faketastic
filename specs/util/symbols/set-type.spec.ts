import { Type } from '../../../src/constants';
import { getSymbol, setType } from '../../../src/util';

describe('setType', () => {
  it('should set the Type symbol on the given value to the specified string', () => {
    // arrange
    const expectedType = 'my-type';
    const host = {};

    // act
    setType(expectedType, host);

    // assert
    expect(getSymbol(Type, host)).toBe(expectedType);
  });

  it('should return the given instance', () => {
    // arrange
    const original = {};

    // act
    const result: any = setType('', original);

    // assert
    expect(result).toBe(original);
  });
});
