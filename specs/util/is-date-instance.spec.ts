import { isDateInstance } from '../../src/util';

describe('isDateInstance', () => {
  it('should return true for date instances and false otherwise', () => {
    // arrange, act, assert
    expect(isDateInstance(new Date())).toBe(true);
    expect(isDateInstance(new Date('invalid'))).toBe(true);

    expect(isDateInstance({})).toBe(false);
    expect(isDateInstance([])).toBe(false);
    expect(isDateInstance(12387472)).toBe(false);
    expect(isDateInstance('Monday, April 12th 2010')).toBe(false);
    expect(isDateInstance(() => {})).toBe(false);
    expect(isDateInstance(false)).toBe(false);
    expect(isDateInstance(null)).toBe(false);
    expect(isDateInstance(undefined)).toBe(false);
  });
});
