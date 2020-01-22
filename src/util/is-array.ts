/**
 * Determines if a given value is an `Array`.
 * @param value The value to check if it is an `Array`.
 * @returns `true` if the value is an `Array`, `false` otherwise.
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}
