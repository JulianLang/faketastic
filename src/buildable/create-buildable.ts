import { Type, Types } from '../constants';
import { AttachedFn } from '../types';
import { Buildable } from './buildable';

/**
 * Creates a new `Buildable`object with the specified properties.
 * @param value The value to set as initial value.
 * @param attachedFns (Optional) The attached functions to associated with this `Buildable`.
 */
export function createBuildable(value: any, attachedFns: AttachedFn[] = []): Buildable {
  return {
    [Type]: Types.Buildable,
    value,
    attachedFns,
  };
}
