import { Type } from '../../constants';
import { getSymbol } from './get-symbol';

/**
 * Determines whether a given value is of a specified type.
 * @param value The value to check if it has the requested type.
 * @param type The type-identifier to match.
 * @returns `true` if the value's type-identifier matches the specified one, `false` otherwise.
 */
export function isType<T = any>(type: string, value: any): value is T {
  return getSymbol(Type, value) === type;
}
