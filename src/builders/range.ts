import { Buildable, BuilderFn, createBuildable, createBuilderFn, randomInt } from '../core';
import { AttachedFn } from '../types';

export function range(min = 1, max = 10, ...attachedFns: AttachedFn[]): Buildable<BuilderFn> {
  const rangeBuilder = createBuilderFn(rangeImpl);

  return createBuildable(rangeBuilder, attachedFns);

  function rangeImpl() {
    // TODO: langju: make min/max completely optional. `range(quantity(2))` should be valid for example.
    return randomInt(min, max);
  }
}
