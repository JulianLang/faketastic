/**
 * Checks whether a given value is a `Date`-instance.
 * @param value The value to check whether it is a `Date` instance.
 * @returns `true` if the value is a `Date` instance, `false` otherwise.
 */
export function isDateInstance(value: any): value is Date {
  // see: https://stackoverflow.com/a/643827/3063191
  return Object.prototype.toString.call(value) === '[object Date]';
}
