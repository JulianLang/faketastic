import { dateTime } from './date-time.generator';
import { DateTimeOpts } from './types';

const defaultTimeFormat = 'HH:mm:ss';

export function time(min: string, max: string) {
  const timeOpts: DateTimeOpts = {
    startFormat: defaultTimeFormat,
    endFormat: defaultTimeFormat,
  };

  return dateTime(min, max, timeOpts);
}
