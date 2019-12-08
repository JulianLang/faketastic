import { setSymbol } from '../../src/util';

describe('setSymbol', () => {
  it('should set a given symbol with specified value on an object', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const value = 42;
    const obj: any = {};

    // act
    setSymbol(mySymbol, obj, value);

    // assert
    expect(obj[mySymbol]).toBe(value);
  });

  it('should set a given symbol with specified value on an array', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const value = 42;
    const array: any = [];

    // act
    setSymbol(mySymbol, array, value);

    // assert
    expect(array[mySymbol]).toBe(value);
  });

  it('should set a given symbol with specified value on a function', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const value = 42;
    const fn: any = () => {};

    // act
    setSymbol(mySymbol, fn, value);

    // assert
    expect(fn[mySymbol]).toBe(value);
  });

  it('should accept null as value', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const value = null;
    const obj: any = {};

    // act
    setSymbol(mySymbol, obj, value);

    // assert
    expect(obj[mySymbol]).toBe(value);
  });

  it('should turn undefined into true as value (default parameter value)', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const obj: any = {};

    // act
    setSymbol(mySymbol, obj, undefined);

    // assert
    expect(obj[mySymbol]).toBe(true);
  });
});
