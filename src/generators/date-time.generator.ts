import isWithinInterval from 'date-fns/isWithinInterval';
import parse from 'date-fns/parse';
import { isDefined, randomInt } from '../core';
import { DateTimeOpts } from './types';

const defaultDateTimeFormat = 'dd.MM.yyyy HH:mm:ss';

export interface dateTime {
  (min: string, max: string, opts?: DateTimeOpts): Date;
}

export function dateTime(min: string, max: string, opts?: DateTimeOpts) {
  if (!isDefined(opts)) {
    opts = {};
  }

  const minDate = getDate(min, opts.startFormat);
  const maxDate = getDate(max, opts.endFormat);
  const interval: Interval = {
    start: minDate,
    end: maxDate,
  };

  // use 01.01.1970 00:00:00 as default fallback date
  let date = new Date(0);

  // TODO: langju: better implementation needed?
  do {
    date = randomDate(interval.start as Date, interval.end as Date);
  } while (!isWithinInterval(date, interval));

  return date;
}

function getDate(input: string, format?: string): Date {
  const normalized = input.trim().toLowerCase();
  let date: Date;

  if (normalized === 'today') {
    // TODO: use time()
    date = new Date();
  } else {
    date = parse(input, format || defaultDateTimeFormat, new Date());
  }

  return date;
}

function randomDate(min: Date, max: Date) {
  const year = randomInt(min.getFullYear(), max.getFullYear());
  const month = randomInt(0, 11);
  const day = randomInt(1, 31);
  const hour = randomInt(0, 24);
  const minute = randomInt(0, 60);
  const second = randomInt(0, 60);

  return new Date(year, month, day, hour, minute, second, 0);
}
