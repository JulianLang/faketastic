import { dateTimeParser } from '../date-time.parser';

describe('date time formatter', () => {
  it('should accept timestamp', () => {
    // arrange
    const timeString = 1574497160206; // 2019-11-23 08:19:20.206 (UTC)
    const utcDate = Date.UTC(2019, 10, 23, 8, 19, 20, 206);
    const expectedTime = new Date(utcDate);

    // act
    const time = dateTimeParser(timeString);

    // assert
    expect(time).toEqual(expectedTime);
  });

  it('should accept YYYY/MM/DD HH:mm:ss per default', () => {
    // arrange
    const timeString = '2019/12/30 12:11:10';
    const expectedDate = new Date(2019, 11, 30, 12, 11, 10, 0);

    // act
    const date = dateTimeParser(timeString);

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
    const date = dateTimeParser(timeString, { format: formatString });

    // assert
    expect(date).toEqual(expectedDate);
  });

  it('should accept shorter input than the given format', () => {
    // arrange
    const timeString = '2019/12/30';
    const expectedDate = new Date(2019, 11, 30, 0, 0, 0, 0);

    // act
    const date = dateTimeParser(timeString);

    // assert
    expect(date).toEqual(expectedDate);
  });

  it('should accept longer input than the given format', () => {
    // arrange
    const timeString = '12:11:10';
    const expectedTime = new Date().setHours(12, 11, 0, 0);
    const expectedDate = new Date(expectedTime);

    // act
    const date = dateTimeParser(timeString, { format: 'HH:mm' });

    // assert
    expect(date).toEqual(expectedDate);
  });
});
