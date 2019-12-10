import { getSymbol } from '../../src/util';

describe('getSymbol', () => {
  const TestSymbol = Symbol('faketastic.test');

  it('should return the value of an existing symbol on an object', () => {
    // arrange
    const value = 'hello';
    const obj = {
      [TestSymbol]: value,
    };

    // act
    const result = getSymbol(TestSymbol, obj);

    // assert
    expect(result).toBe(value);
  });

  it('should return the value of an existing symbol on an array', () => {
    // arrange
    const value = 'hello';
    const array: any = [];
    array[TestSymbol] = value;

    // act
    const result = getSymbol(TestSymbol, array);

    // assert
    expect(result).toBe(value);
  });

  it('should return the value of an existing symbol on a function', () => {
    // arrange
    const value = 'hello';
    const fn: any = () => {};
    fn[TestSymbol] = value;

    // act
    const result = getSymbol(TestSymbol, fn);

    // assert
    expect(result).toBe(value);
  });

  it('should return undefined when the given symbol is not present on the given value', () => {
    // arrange
    const obj = {};

    // act
    const result = getSymbol(TestSymbol, obj);

    // assert
    expect(result).toBe(undefined);
  });

  it('should return undefined if given value is null or undefined', () => {
    // arrange, act, assert
    expect(getSymbol(TestSymbol, null)).toBe(undefined);
    expect(getSymbol(TestSymbol, undefined)).toBe(undefined);
  });
});
