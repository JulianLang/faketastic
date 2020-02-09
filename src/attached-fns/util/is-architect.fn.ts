import { Types } from '../../constants';
import { isType } from '../../util';
import { ArchitectFn } from '../attached.fn';

/**
 * Determines whether a given value is an `ArchitectFn`.
 * @param fn The function to check if it is an `ArchitectFn`.
 * @returns `true` if the given value is an `ArchitectFn`, `false` otherwise.
 */
export function isArchitectFn(fn: any): fn is ArchitectFn {
  return isType(fn, Types.ArchitectFn);
}
