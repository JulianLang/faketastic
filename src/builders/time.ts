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
 * Generates a random time, while using today's date. Parameters can be of type `TimeInput` allowing
 * you to pass your time restrictions in several formats:
 *
 * - `'now'`: Date time of the moment it gets called.
 * - string: `"12:41:02"`: Simple time string (in format HH:mm:ss or HH:mm).
 * - string[]: `["01:41 pm", "HH:mm aa"]`: Time string with specified format.
 * - number: `1574497160206`: Time number as it is produced by `new Date().getTime()` for example
 * - date: `new Date()`: A native JavaScript `Date`-instance.
 *
 * **Please note:** faketastic currently does not handle time zones.
 *
 * ---
 *
 * Usage examples:
 *
 * ~~~ts
 * // any time from 00:00:00 to 23:59:59
 * time();
 * // exact date and time now
 * time('now');
 * // exact time: 13:32:00
 * time('13:32:00');
 * // exact time: 13:32:00
 * time(['01:32 pm', 'HH:mm aa']);
 * // any from 12:00:00 to 13:00:00, today
 * time('12:00:00', '13:00');
 * // any from 12:00:00 to 13:00:00, today
 * time(['12:10:10', 'HH:mm:ss'], ['19:24', 'HH:mm']);
 * // any from now to 23:59:59, today
 * time(new Date(), null);
 * // any from 11:00:00 to 23:59:59, today
 * time('11:00', null);
 * // any from 00:00:00 to 04:00:00, today
 * time(null, '04:00');
 * ~~~
 * @param earliest Time string, number or date object to be used as earliest allowed time. Default format is HH:mm:ss - `13:15:00`
 * @param latest Time string, number or date object to be used as latest allowed time. Default format is HH:mm:ss - `13:15:00`
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
