import { Types } from '../constants';
import { isType } from '../util';
import { Buildable } from './buildable';

/**
 * Determines whether a given value is a `Buildable`.
 * @param value The value to check if it is a `Buildable`.
 */
export function isBuildable(value: any): value is Buildable {
  return isType(Types.Buildable, value);
}
