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
});
