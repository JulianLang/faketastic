import { hasSymbol } from '../../../src/util';

describe('hasSymbol', () => {
  const TestSysmbol = Symbol('sym1');

  it('should return true if the symbol is present', () => {
    // arrange
    const obj: any = {
      [TestSysmbol]: 42,
    };

    // act
    const result = hasSymbol(TestSysmbol, obj);

    // assert
    expect(result).toBe(true);
  });

  it('should return false if the symbol is not present', () => {
    // arrange
    const obj: any = {};

    // act
    const result = hasSymbol(TestSysmbol, obj);

    // assert
    expect(result).toBe(false);
  });

  it('should return false if the given object is not defined', () => {
    // arrange, act, assert
    expect(hasSymbol(TestSysmbol, undefined)).toBe(false);
    expect(hasSymbol(TestSysmbol, null)).toBe(false);
  });
});
