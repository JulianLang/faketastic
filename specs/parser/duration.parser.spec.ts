import { duration } from '../../src/parser/duration.parser';

describe('duration parser', () => {
  it('should return a date adding the specified min/max duration', () => {
    // arrange
    const date = new Date(2019, 11, 1, 13, 0, 0);
    const expectedDate = new Date(2019, 11, 1, 13, 1, 0);

    // act
    const futureDate = duration(date, [1, 'minutes'], [1, 'minutes']);

    // assert
    expect(futureDate).toEqual(expectedDate);
  });

  it('should accept negative duration', () => {
    // arrange
    const date = new Date(2019, 11, 1, 13, 1, 0);
    const expectedDate = new Date(2019, 11, 1, 13, 0, 0);

    // act
    const futureDate = duration(date, [-1, 'minutes'], [-1, 'minutes']);

    // assert
    expect(futureDate).toEqual(expectedDate);
  });
});
