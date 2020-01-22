import { clone } from './clone';

/**
 * Clones the given array by cloning each item and returns the result.
 * @param array The array to clone.
 * @returns The cloned array.
 */
export function cloneItems(array: any[]): any[] {
  return array.map(value => clone(value));
}
