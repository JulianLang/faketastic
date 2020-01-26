import { Types } from '../../constants';
import { AnyFn } from '../../types';
import { isType } from '../../util';

/**
 * Determines whether a given value is a `ReaderFn`.
 * @param fn The function to check if it is a `ReaderFn`.
 * @returns `true` if the given value is a `ReaderFn`, `false` otherwise.
 */
export function isReaderFn(fn: AnyFn): boolean {
  return isType(fn, Types.ReaderFn);
}
