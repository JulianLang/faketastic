import { dateTimeFormatter } from '../date-time.formatter';

describe('date time formatter', () => {
  it('should accept YYYY/MM/DD HH:mm:ss per default', () => {
    // arrange
    const timeString = '2019/12/30 12:11:10';
    const expectedTime = new Date(2019, 11, 30).setHours(12, 11, 10, 0);
    const expectedDate = new Date(expectedTime);

    // act
    const date = dateTimeFormatter(timeString);

    // assert
    expect(date).toEqual(expectedDate);
  });

  it('should accept a custom format', () => {
    // arrange
    const timeString = '2019-31/01 12:11:10';
    const formatString = 'YYYY-DD/MM HH:mm:ss';
    const expectedTime = new Date(2019, 0, 31).setHours(12, 11, 10, 0);
    const expectedDate = new Date(expectedTime);

    // act
    const date = dateTimeFormatter(timeString, formatString);

    // assert
    expect(date).toEqual(expectedDate);
  });

  it('should accept shorter input than the given format', () => {
    // arrange
    const timeString = '2019/12/30';
    const expectedDate = new Date(2019, 11, 30, 0, 0, 0, 0);

    // act
    const date = dateTimeFormatter(timeString);

    // assert
    expect(date).toEqual(expectedDate);
  });

  it('should accept longer input than the given format', () => {
    // arrange
    const timeString = '12:11:10';
    const expectedTime = new Date().setHours(12, 11, 0, 0);
    const expectedDate = new Date(expectedTime);

    // act
    const date = dateTimeFormatter(timeString, 'HH:mm');

    // assert
    expect(date).toEqual(expectedDate);
  });
});
