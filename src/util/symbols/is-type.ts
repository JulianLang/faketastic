import { getSymbol, hasSymbol } from '.';
import { Type } from '../../constants';

/**
 * Determines whether a given value is of a specified type.
 * @param value The value to check if it has the requested type.
 * @param type The type-identifier to match.
 * @returns `true` if the value's type-identifier matches the specified one, `false` otherwise.
 */
export function is(value: any, type: string): boolean {
  return hasSymbol(Type, value) ? getSymbol(Type, value) === type : false;
}
