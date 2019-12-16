import { isArray } from '../../../src';

describe('isArray', () => {
  it('should return true for arrays and false otherwise', () => {
    // arrange, act, assert
    expect(isArray([])).toBe(true);
    expect(isArray([null])).toBe(true);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(12)).toBe(false);
    expect(isArray(true)).toBe(false);
    expect(isArray(() => {})).toBe(false);
    expect(isArray('str')).toBe(false);
    expect(isArray({})).toBe(false);
  });
});
