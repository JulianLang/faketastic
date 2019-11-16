import { dateTime } from './date-time.generator';

const defaultTimeFormat = 'HH:mm:ss';

export function time(min: string, max: string) {
  const timeOpts = {
    minFormat: defaultTimeFormat,
    maxFormat: defaultTimeFormat,
  };

  return dateTime(min, max, timeOpts);
}
