import { getSymbol } from '../../src/util';

describe('getSymbol', () => {
  it('should return the value of an existing symbol on an object', () => {
    // arrange
    const value = 'hello';
    const mySymbol1 = Symbol('sym1');
    const obj = {
      [mySymbol1]: value,
    };

    // act
    const result = getSymbol(mySymbol1, obj);

    // assert
    expect(result).toBe(value);
  });

  it('should return the value of an existing symbol on an array', () => {
    // arrange
    const value = 'hello';
    const mySymbol1 = Symbol('sym1');
    const array: any = [];
    array[mySymbol1] = value;

    // act
    const result = getSymbol(mySymbol1, array);

    // assert
    expect(result).toBe(value);
  });

  it('should return the value of an existing symbol on a function', () => {
    // arrange
    const value = 'hello';
    const mySymbol1 = Symbol('sym1');
    const fn: any = () => {};
    fn[mySymbol1] = value;

    // act
    const result = getSymbol(mySymbol1, fn);

    // assert
    expect(result).toBe(value);
  });

  it('should return undefined when the given symbol is not present on the given value', () => {
    // arrange
    const mySymbol1 = Symbol('sym1');
    const obj = {};

    // act
    const result = getSymbol(mySymbol1, obj);

    // assert
    expect(result).toBe(undefined);
  });
});
