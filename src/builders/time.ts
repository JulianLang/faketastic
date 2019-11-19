import { Buildable, BuildableSymbol, BuilderFn, createBuilderFn, ProcessorFn } from '../core';
import { DateTimeOpts } from './types';

/**
 * Generates a random time, while using today's date.
 * @param earliest Time string to be used as earliest allowed time. HH:mm:ss - `13:15:00`
 * @param latest Time string to be used as latest allowed time. HH:mm:ss - `13:15:00`
 */
export function time(
  earliest: string = '00:00:00',
  latest: string = '23:59:59',
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
    return null;
  }
}
