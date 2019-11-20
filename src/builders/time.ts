import {
  Buildable,
  BuildableSymbol,
  BuilderFn,
  createBuilderFn,
  ProcessorFn,
  randomDate,
} from '../core';
import { dateTimeParser } from '../parser';
import { isArray, isDefined } from '../util';
import { DateTimeOpts, TimeInput } from './types';

/**
 * Generates a random time, while using today's date.
 * @param earliest Time string to be used as earliest allowed time. HH:mm:ss - `13:15:00`
 * @param latest Time string to be used as latest allowed time. HH:mm:ss - `13:15:00`
 */
export function time(
  earliest: TimeInput = '00:00:00:000',
  latest: TimeInput = '23:59:59:999',
  opts?: DateTimeOpts,
  ...processors: ProcessorFn[]
): Buildable<BuilderFn> {
  const timeBuilder = createBuilderFn(timeImpl);

  return {
    [BuildableSymbol]: 'template',
    processors,
    value: timeBuilder,
  };

  function timeImpl() {
    if (!isDefined(earliest)) {
      earliest = '00:00:00:000';
    }
    if (!isDefined(latest)) {
      latest = '23:59:59:999';
    }

    const startDate = getDate(earliest);
    const endDate = getDate(latest);

    return randomDate(startDate, endDate);
  }

  function getDate(input: TimeInput): Date {
    return isArray(input) ? getFormattedTime(input) : dateTimeParser(input);
  }

  function getFormattedTime(input: string[]): Date {
    // hours : minutes : seconds : milliseconds
    const defaultFormat = 'HH:mm:ss:SSS';

    const inputString = input[0];
    const format = input.length >= 2 ? input[1] : defaultFormat;

    return dateTimeParser(inputString, format);
  }
}
