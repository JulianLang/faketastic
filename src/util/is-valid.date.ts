/**
 * Determines whether a given value is a valid `Date` instance.
 * @param date The date instance to check for validity.
 * @returns `true` if the given value is a valid `Date` instance, `false` otherwise.
 */
export function isValidDate(date: Date) {
  return isNaN(date as any) === false;
}
