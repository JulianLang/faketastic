import { Types } from '../constants';
import { AnyFn } from '../types';
import { isType } from '../util';

/**
 * Determines whether a given value is an `ArchitectFn`.
 * @param fn The function to check if it is an `ArchitectFn`.
 * @returns `true` if the given value is an `ArchitectFn`, `false` otherwise.
 */
export function isArchitectFn(fn: AnyFn): boolean {
  return isType(fn, Types.ArchitectFn);
}
