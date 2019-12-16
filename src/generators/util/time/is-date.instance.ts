/** Checks whether a given value is a `Date`-instance. */
export function isDateInstance(value: any): value is Date {
  // see: https://stackoverflow.com/a/643827/3063191
  return Object.prototype.toString.call(value) === '[object Date]';
}
