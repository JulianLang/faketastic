import { Types } from '../../constants';
import { isType } from '../../util';
import { ReaderFn } from '../attached.fn';

/**
 * Determines whether a given value is a `ReaderFn`.
 * @param fn The function to check if it is a `ReaderFn`.
 * @returns `true` if the given value is a `ReaderFn`, `false` otherwise.
 */
export function isReaderFn(fn: any): fn is ReaderFn {
  return isType(fn, Types.ReaderFn);
}
