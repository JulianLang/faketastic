import { isDefined } from '../../util';
import { Buildable } from '../types';
import { isBuildable } from './is-buildable';

/** Determines whether at least one item of a given array is a Buildable */
export function isBuildableArray<T = any>(value: any): value is (Buildable | T)[] {
  if (!isDefined(value) || !Array.isArray(value)) {
    return false;
  }

  return value.length > 0 && value.some(v => isBuildable(v));
}
