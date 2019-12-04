import { isBuildable } from './is-buildable';

/**
 * Takes a value that might be a `Buildable` and starts looking for the most nested `Buildable`
 * by recursively checking if the `Buildable.value` is a `Buildable` again.
 * @param value A value that might be a `Buildable` to start searching for nested `Buildable`s.
 */
export function getLeafBuildable(value: any): any {
  while (isBuildable(value)) {
    value = value.value;
  }

  return value;
}
