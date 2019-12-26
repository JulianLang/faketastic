import { Buildable, createBuildable, randomInt } from '../core';
import { AttachedFn } from '../types';
import { addIfAttachedFn } from '../util';
import { ValueFn } from './types';
import { createValueFn } from './util';

export function range(
  min: number | AttachedFn = 1,
  max: number | AttachedFn = 10,
  ...attachedFns: AttachedFn[]
): Buildable<ValueFn> {
  const rangeValueFn = createValueFn(rangeImpl);

  if (addIfAttachedFn(min, attachedFns)) {
    min = 1;
  }

  if (addIfAttachedFn(max, attachedFns)) {
    max = 10;
  }

  return createBuildable(rangeValueFn, attachedFns);

  function rangeImpl() {
    return randomInt(min as number, max as number);
  }
}
