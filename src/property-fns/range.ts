import { AttachedFn } from '../attached-fns';
import { Buildable, createBuildable } from '../buildable';
import { Func } from '../types';
import { sortArgsByType } from '../util';
import { createValueFn, randomInt, ValueFn } from '../value-fns';

interface RangeOptions {
  valueFn?: Func<[number?, number?], number>;
}

/**
 *
 * @param min The minimal valid value.
 * @param max The maximal valid value.
 * @param options (Optional) Additional options object.
 * @param attachedFns An arbitrary number of attached functions.
 */
export function range(
  min: number,
  max: number,
  options?: RangeOptions | AttachedFn,
  ...attachedFns: AttachedFn[]
): Buildable<ValueFn<number>> {
  const { args, attached } = sortArgsByType({ min, max, options, attachedFns });
  const opts = (args.options || {}) as RangeOptions;

  const fn = opts.valueFn || randomInt;
  const valueFn = createValueFn(() => fn(args.min, args.max));

  return createBuildable(valueFn, attached);
}
