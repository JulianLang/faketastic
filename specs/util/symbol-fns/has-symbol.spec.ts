import { hasSymbol } from '../../../src/util';

describe('hasSymbol', () => {
  it('should return true if the symbol is present', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const obj: any = {
      [mySymbol]: 42,
    };

    // act
    const result = hasSymbol(mySymbol, obj);

    // assert
    expect(result).toBe(true);
  });

  it('should return false if the symbol is not present', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const obj: any = {};

    // act
    const result = hasSymbol(mySymbol, obj);

    // assert
    expect(result).toBe(false);
  });

  it('should return true if the symbol is present and has the correct value', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const value = 42;
    const obj: any = {
      [mySymbol]: value,
    };

    // act
    const result = hasSymbol(mySymbol, obj, value);

    // assert
    expect(result).toBe(true);
  });

  it('should return false if the symbol is present, but has not the correct value', () => {
    // arrange
    const mySymbol = Symbol('sym1');
    const value = 42;
    const obj: any = {
      [mySymbol]: value,
    };

    // act
    const result = hasSymbol(mySymbol, obj, value + 1);

    // assert
    expect(result).toBe(false);
  });
});
