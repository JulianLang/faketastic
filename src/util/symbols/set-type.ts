import { Type } from '../../constants/symbols';
import { setSymbol } from './set-symbol';

/**
 * Sets the specified type identifier on the given value.
 * @param type The type identifier to set.
 * @param on The value to set the type on.
 */
export function setType<T = any>(type: string, on: T): T & Record<typeof Type, any> {
  return setSymbol(Type, on, type);
}
