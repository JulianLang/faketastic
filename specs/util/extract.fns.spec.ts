import { extractFns, setSymbol } from '../../src/util';

describe('extractFns helper', () => {
  it('should return all functions having the given symbol', () => {
    // arrange
    const MySymb1 = Symbol('sym1');
    const MySymb2 = Symbol('sym2');
    const fn1 = setSymbol(MySymb1, () => {});
    const fn2 = setSymbol(MySymb2, () => {});
    const fn3 = setSymbol(MySymb1, () => {});
    const fns: Function[] = [fn1, fn2, fn3];

    // act
    const symbol1Fns = extractFns(MySymb1, fns);

    // assert
    expect(symbol1Fns).toEqual([fn1, fn3]);
  });
});
