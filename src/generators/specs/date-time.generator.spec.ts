import isWithinInterval from 'date-fns/isWithinInterval';
import { dateTime } from '../date-time.generator';

describe('date time generator', () => {
  it('should generate a date within a valid range', () => {
    // arrange
    const interval: Interval = {
      // please note: js counts months starting at 0. So february becomes 1, not 2 for example
      start: new Date(2010, 1, 5),
      end: new Date(2010, 1, 6),
    };

    // act
    const result = dateTime('05.02.2010 00:00:00', '06.02.2010 00:00:00');

    // assert
    expect(isWithinInterval(result, interval)).toBe(true);
  });

  it('should accept a different input format', () => {
    // arrange
    const interval: Interval = {
      // please note: js counts months starting at 0. So february becomes 1, not 2 for example
      start: new Date(2012, 4, 10),
      end: new Date(2012, 4, 11),
    };

    // act
    const result = dateTime('10.05.2012', '11.05.2012', {
      startFormat: 'dd.MM.yyyy',
      endFormat: 'dd.MM.yyyy',
    });

    // assert
    expect(isWithinInterval(result, interval)).toBe(true);
  });
});
