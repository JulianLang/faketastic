import { isDefined } from '../../../src';

describe('isDefined', () => {
  it('should return false for null and undefined, and true otherwise', () => {
    // arrange, act, assert
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);

    expect(isDefined(false)).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined(NaN)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(``)).toBe(true);
  });
});
