import { Buildable, createBuildable, randomInt } from '../core';
import { AttachedFn } from '../types';
import { ValueFn } from './types';
import { createValueFn } from './util';

export function range(min = 1, max = 10, ...attachedFns: AttachedFn[]): Buildable<ValueFn> {
  const rangeValueFn = createValueFn(rangeImpl);

  return createBuildable(rangeValueFn, attachedFns);

  function rangeImpl() {
    // TODO: langju: make min/max completely optional. `range(quantity(2))` should be valid for example.
    return randomInt(min, max);
  }
}
