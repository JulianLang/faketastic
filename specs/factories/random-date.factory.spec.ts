import { randomDate } from '../../src/factories/random-date.factory';

describe('randomDate', () => {
  it('should return a random date between the given range', () => {
    for (let i = 0; i < 1000; i++) {
      // arrange
      const minDate = new Date(2020, 0, 1);
      const maxDate = new Date(2020, 0, 3);

      // act
      const date = randomDate(minDate, maxDate);

      // assert
      expect(date.getFullYear()).toBe(2020);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBeGreaterThanOrEqual(1);
      expect(date.getDate()).toBeLessThanOrEqual(3);
    }
  });
});
