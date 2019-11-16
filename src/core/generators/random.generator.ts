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
