import { randomInt } from './random-int.factory';

/**
 * Gets a random, yet valid index for a given array.
 * @param values The array from which to get a random index
 */
export function randomIndex(values: any[]): number {
  return randomInt(0, values.length - 1);
}
