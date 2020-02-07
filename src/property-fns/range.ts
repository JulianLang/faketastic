import { AttachedFn } from '../attached-fns';
import { Buildable, createBuildable } from '../buildable';
import { Func } from '../types';
import { createValueFn, randomInt, ValueFn } from '../value-fns';

/**
 * Computes a random value within the specified range.
 * @param min The minimal valid value.
 * @param max The maximal valid value.
 * @param options (Optional) Additional options object.
 * @param attachedFns An arbitrary number of attached functions.
 */
export function range(
  min: number,
  max: number,
  ...attachedFns: AttachedFn[]
): Buildable<ValueFn<number>> {
  const valueFn = createValueFn((buildable: Buildable) => {
    const impl: Func<number[], number> =
      buildable.attachedProperties['faketastic:range:strategy'] || randomInt;

    return impl(min, max);
  });

  return createBuildable(valueFn, attachedFns);
}
