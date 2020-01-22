import { cloneDeep } from 'lodash';

/**
 * Clones a given value and returns the result.
 * @param value The value to clone.
 * @returns The cloned value.
 */
export function clone(value: any): any {
  return cloneDeep(value);
}
