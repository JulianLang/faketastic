/**
 * Determines whether a given value is defined.
 * @param value The value to check if it is defined.
 * @returns `true` if the given value is not `null` or `undefined`, `false` otherwise.
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
