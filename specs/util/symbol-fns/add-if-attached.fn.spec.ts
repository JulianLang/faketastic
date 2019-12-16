import { addIfAttachedFn, AttachedFn, AttachedFnSymbol, setSymbol } from '../../../src';

describe('addIfAttachedFn', () => {
  it('should return true and add the given value to the given array if it is an AttachedFn', () => {
    // arrange
    const attachedFn: any = setSymbol(AttachedFnSymbol, () => {});
    const fns: AttachedFn[] = [];

    // act
    const result = addIfAttachedFn(attachedFn, fns);

    // assert
    expect(result).toBe(true);
    expect(fns).toEqual([attachedFn]);
  });

  it('should return false and if the given value is not an AttachedFn', () => {
    // arrange
    const fn = () => {};
    const fns: AttachedFn[] = [];

    // act
    const result = addIfAttachedFn(fn, fns);

    // assert
    expect(result).toBe(false);
    expect(fns).toEqual([]);
  });

  it('should not remove values already present in array', () => {
    // arrange
    const fn: any = () => {};
    const fn2: any = setSymbol(AttachedFnSymbol, () => {});
    const fns: AttachedFn[] = [fn];

    // act
    const result = addIfAttachedFn(fn2, fns);

    // assert
    expect(result).toBe(true);
    expect(fns).toEqual([fn, fn2]);
  });
});
