import { isUndefined } from '../../../src';

describe('isUndefined', () => {
  it('should return true for null and undefined, and false otherwise', () => {
    // arrange, act, assert
    expect(isUndefined(null)).toBe(true);
    expect(isUndefined(undefined)).toBe(true);

    expect(isUndefined(false)).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined(NaN)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(``)).toBe(false);
  });
});
