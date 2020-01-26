import { Buildable } from './buildable';
import { createBuildable } from './create-buildable';
import { isBuildable } from './is-buildable';

/**
 * Converts a given value into a `Buildable`, if it is not already one.
 * @param value The value to be converted into a `Buildable`, if necessary.
 * @returns a newly created `Buildable` if the value wan none, the original instance otherwise.
 */
export function asBuildable(value: any): Buildable {
  return isBuildable(value) ? value : createBuildable(value);
}
