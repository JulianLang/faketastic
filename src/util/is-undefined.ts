import { isDefined } from './is-defined';

/**
 * Determines whether a given value is `null` or `undefined`.
 * @param value The value to check if it is `null` or `undefined`.
 * @returns `true` if the value is `null` or `undefined`, `false` otherwise.
 */
export function isUndefined<T>(value: T | null | undefined): value is null | undefined {
  return !isDefined(value);
}
