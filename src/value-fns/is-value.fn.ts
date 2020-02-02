import { Types } from '../constants';
import { isType } from '../util';
import { ValueFn } from './value.fn';

/**
 * Determines whether the given value is a `ValueFn`.
 * @param value The value to check if it is a `ValueFn`.
 * @returns `true` if the given value is a `ValueFn`, `false` otherwise.
 */
export function isValueFn(value: any): value is ValueFn {
  return isType(value, Types.ValueFn);
}
