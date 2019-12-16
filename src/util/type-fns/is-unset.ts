import { UnsetSymbol } from '../../constants';
import { hasSymbol } from '../symbol-fns/has-symbol';

/**
 * Determines whether a given value is `UnsetValue`.
 * @param value The value to be checked if unset.
 */
export function isUnset(value: any): boolean {
  return hasSymbol(UnsetSymbol, value);
}
