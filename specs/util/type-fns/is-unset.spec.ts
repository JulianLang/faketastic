import { UnsetValue } from '../../../src/constants';
import { isUnset } from '../../../src/util';

describe('isUnset', () => {
  it('should return true for UnsetValue, false otherwise', () => {
    // arrange, act, assert
    expect(isUnset(UnsetValue)).toBe(true);

    expect(isUnset(null)).toBe(false);
    expect(isUnset(undefined)).toBe(false);
    expect(isUnset(false)).toBe(false);
    expect(isUnset(0)).toBe(false);
    expect(isUnset(NaN)).toBe(false);
    expect(isUnset('')).toBe(false);
    expect(isUnset('')).toBe(false);
    expect(isUnset(``)).toBe(false);
  });
});
