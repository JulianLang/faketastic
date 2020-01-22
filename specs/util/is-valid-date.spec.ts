import { isValidDate } from '../../src/util';

describe('isValidDate', () => {
  it('should return true for valid dates and false otherwise', () => {
    // arrange, act, assert
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('invalid'))).toBe(false);
  });
});
