import { Buildable } from '../types/buildable';
import { createBuildable } from './create-buildable';
import { isBuildable } from './is-buildable';

/** Converts a value into a `Buildable`, if the value is not already one. */
export function asBuildable<T>(value: any): Buildable<T> {
  return isBuildable(value) ? value : createBuildable(value);
}
