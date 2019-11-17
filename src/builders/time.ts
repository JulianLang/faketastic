import moment from 'moment';
import { randomDate } from '../core';
import { isDefined } from '../util';
import { DateParserFn, DateTimeOpts } from './types';

/**
 * Generates a random time, while using today's date.
 * @param earliest Time string to be used as earliest allowed time. HH:mm:ss - `13:15:00`
 * @param latest Time string to be used as latest allowed time. HH:mm:ss - `13:15:00`
 */
export function time(earliest: string, latest: string, opts?: DateTimeOpts): Date {
  if (!isDefined(opts)) {
    opts = {};
  }

  const customParserFns = opts.parserFns || [];
  const parserFns = [...customParserFns, parseFormat, parseKeywordFuture];

  const start = tryParse(parserFns, earliest, opts.startFormat);
  const end = tryParse(parserFns, latest, opts.endFormat);

  if (!isDefined(start)) {
    throw new Error(`faketastic: Could not parse time's "earliest"-parameter: "${earliest}".`);
  }
  if (!isDefined(end)) {
    throw new Error(`faketastic: Could not parse time's "latest"-parameter: "${latest}".`);
  }

  return randomDate(start, end);
}

function tryParse(parserFns: DateParserFn[], input: string, format?: string): Date | null {
  for (const parserFn of parserFns) {
    const result = parserFn(input, format);

    if (isDefined(result)) {
      return result;
    }
  }

  return null;
}

function parseFormat(time: string, format?: string): Date | null {
  try {
    return moment(time, format).toDate();
  } catch {
    return null;
  }
}
function parseKeywordFuture(time: string): Date | null {
  if (time.toLowerCase() !== 'future') {
    return null;
  }

  // todo: fix
  return new Date();
}
