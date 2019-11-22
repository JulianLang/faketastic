import {
  addIfProcessorFn,
  Buildable,
  BuildableSymbol,
  BuilderFn,
  createBuilderFn,
  ProcessorFn,
  randomDate,
} from '../core';
import { dateTimeParser } from '../parser';
import { isArray, isDefined } from '../util';
import { TimeInput } from './types';

// hours : minutes : seconds : milliseconds
const defaultFormat = 'HH:mm:ss:SSS';

/**
 * Generates a random time, while using today's date.
 * @param earliest Time string to be used as earliest allowed time. HH:mm:ss - `13:15:00`
 * @param latest Time string to be used as latest allowed time. HH:mm:ss - `13:15:00`
 */
export function time(
  earliest?: TimeInput | ProcessorFn,
  latest?: TimeInput | ProcessorFn,
  ...processors: ProcessorFn[]
): Buildable<BuilderFn> {
  const timeBuilder = createBuilderFn(timeImpl);

  if (addIfProcessorFn(earliest, processors)) {
    earliest = undefined;
  }
  if (addIfProcessorFn(latest, processors)) {
    latest = undefined;
  }

  return {
    [BuildableSymbol]: 'template',
    processors,
    value: timeBuilder,
  };

  // TODO: langju: simplify / formalize parameter parsing:
  function timeImpl() {
    // time('now') | time('now', '16:00)
    if (earliest === 'now') {
      earliest = new Date();

      // time('now')
      if (latest === undefined) {
        latest = new Date();
      }
    }
    // time('12:00')
    if (isDefined(earliest) && latest === undefined) {
      latest = earliest;
    }
    // time() | time(null)
    if (!isDefined(earliest)) {
      // array, to mark as formatted time input
      earliest = ['00:00:00:000'];
    }
    // time('12:00', null)
    if (!isDefined(latest)) {
      // array, to mark as formatted time input
      latest = ['23:59:59:999'];
    }

    const minDate = getDate(earliest as TimeInput);
    const maxDate = getDate(latest as TimeInput);

    return randomDate(minDate, maxDate);
  }

  function getDate(input: TimeInput): Date {
    return isArray(input) ? getFormattedTime(input) : dateTimeParser(input!, defaultFormat);
  }

  function getFormattedTime(input: string[]): Date {
    const inputString = input[0];
    const format = input.length >= 2 ? input[1] : defaultFormat;

    return dateTimeParser(inputString, format);
  }
}
