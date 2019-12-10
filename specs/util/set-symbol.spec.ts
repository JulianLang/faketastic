import { setSymbol } from '../../src/util';

describe('setSymbol', () => {
  const TestSymbol = Symbol('faketastic.test');

  it('should return the result', () => {
    // arrange
    const value = 42;
    const obj: any = {};

    // act
    const obj2 = setSymbol(TestSymbol, obj, value);

    // assert
    expect(obj2).toBe(obj);
  });

  it('should set a given symbol with specified value on an object', () => {
    // arrange
    const value = 42;
    const obj: any = {};

    // act
    setSymbol(TestSymbol, obj, value);

    // assert
    expect(obj[TestSymbol]).toBe(value);
  });

  it('should set a given symbol with specified value on an array', () => {
    // arrange
    const value = 42;
    const array: any = [];

    // act
    setSymbol(TestSymbol, array, value);

    // assert
    expect(array[TestSymbol]).toBe(value);
  });

  it('should set a given symbol with specified value on a function', () => {
    // arrange
    const value = 42;
    const fn: any = () => {};

    // act
    setSymbol(TestSymbol, fn, value);

    // assert
    expect(fn[TestSymbol]).toBe(value);
  });

  it('should accept null as value', () => {
    // arrange
    const value = null;
    const obj: any = {};

    // act
    setSymbol(TestSymbol, obj, value);

    // assert
    expect(obj[TestSymbol]).toBe(value);
  });

  it('should turn undefined into true as value (default parameter value)', () => {
    // arrange
    const obj: any = {};

    // act
    setSymbol(TestSymbol, obj, undefined);

    // assert
    expect(obj[TestSymbol]).toBe(true);
  });
});
