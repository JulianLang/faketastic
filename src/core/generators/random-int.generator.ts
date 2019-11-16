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
