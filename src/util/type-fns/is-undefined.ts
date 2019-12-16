import { isDefined } from './is-defined';

/** Determines whether a given value is `null` or `undefined`. */
export function isUndefined<T>(value: T | null | undefined): value is null | undefined {
  return !isDefined(value);
}
