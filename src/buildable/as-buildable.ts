import { AttachedFn } from '../attached-fns';
import { Buildable } from './buildable';
import { createBuildable } from './create-buildable';
import { isBuildable } from './is-buildable';

/**
 * Converts a given value into a `Buildable`, if it is not already one.
 * @param value The value to be converted into a `Buildable`, if necessary.
 * @param attachedFns An array of attached functions that should be added to the `Buildable`.
 * @returns a newly created `Buildable` if the value wan none, the original instance otherwise.
 * Optionally containing specified attached functions.
 */
export function asBuildable(value: any, attachedFns: AttachedFn[] = []): Buildable {
  const target = isBuildable(value) ? value : createBuildable(value);

  if (attachedFns.length > 0) {
    target.attachedFns.push(...attachedFns);
  }

  return target;
}
