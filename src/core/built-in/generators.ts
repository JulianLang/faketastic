/**
 * Gets a random float number in the given range. Minimum and maximum parameters are meant inclusively.
 * If not specified the default range is from minimum 1 to maximum 10.
 * @param min The minimum allowed value (inclusive value)
 * @param max The maximum allowed value (inclusive value)
 */
export function random(min = 1, max = 10): number {
  const result = Math.random() * max + min;

  if (result <= min) {
    return min;
  } else if (result >= max) {
    return max;
  } else {
    return result;
  }
}

/**
 * Gets a random int number in the given range. Minimum and maximum parameters are meant inclusively.
 * If not specified the default range is from minimum 1 to maximum 10.
 * @param min The minimum random number allowed (inclusive value)
 * @param max The maximum random number allowed (inclusive value)
 */
export function randomInt(min = 1, max = 10): number {
  // https://stackoverflow.com/a/1527820/3063191
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets a random, yet valid index for a given array.
 * @param values The array from which to get a random index
 */
export function randomIndex(values: any[]): number {
  return randomInt(0, values.length - 1);
}

/**
 * Gets a random item from a given array. If the array has no items, `null` will be returned.
 * @param values The array from which to get a random item
 */
export function randomItem(values: any[]): any {
  const index = randomIndex(values);

  return values[index];
}

/**
 * Returns true with a given probability.
 * @param n A bias / probability that the value is `true`.
 */
export function probability(n: number): boolean {
  if (n === 1) {
    return true;
  } else if (n === 0) {
    return false;
  }

  return !!n && Math.random() <= n;
}
