import { isBuildable } from './is-buildable';

/**
 * Unwraps a value as long as it is a `Buildable` and returns the bare value at the end.
 * @param value The value that might be a `Buildable` and should be unwrapped.
 */
export function unwrapIfBuildable(value: any): any {
  let unwrapped = value;

  while (isBuildable(unwrapped)) {
    unwrapped = unwrapped.value;
  }

  return unwrapped;
}
