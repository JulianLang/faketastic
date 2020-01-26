import { randomIndex } from './random-index-value.fn';

/**
 * Gets a random item from a given array. If the array has no items, `null` will be returned.
 * @param values The array from which to get a random item
 */
export function randomItem<T>(values: T[]): T | null {
  if (values.length === 0) {
    return null;
  }

  const index = randomIndex(values);

  return values[index];
}
