import { clone } from './clone';

/**
 * Clones the given array by cloning each item and returns the result.
 * @param array The array to clone.
 * @returns The cloned array.
 */
export function cloneItems<T>(array: T[]): T[] {
  return array.map(value => clone(value));
}
