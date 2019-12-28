import { AttachedFn } from '../../types';
import { isDefined } from '../../util';
import { Buildable } from '../types/buildable';
import { addAttachedFns } from './add-attached-fns';
import { createBuildable } from './create-buildable';
import { isBuildable } from './is-buildable';

/** Converts a value into a `Buildable`, if the value is not already one. */
export function asBuildable<T>(value: any, withAttachedFns: AttachedFn[] = []): Buildable<T> {
  const buildable = isBuildable(value) ? value : createBuildable(value);

  if (isDefined(withAttachedFns)) {
    addAttachedFns(withAttachedFns, buildable);
  }

  return buildable;
}
