import { AttachedFn } from '../../src/attached-fns';
import { createBuildable } from '../buildable';
import { cloneItems, sortArgsByType } from '../util';
import { createValueFn } from '../value-fns';
import { randomItems } from '../value-fns/random-items-value.fn';
import { SomeOfOptions } from './types';

const someOfDefaultOpts: SomeOfOptions = {
  allowDuplicates: true,
  minItems: 2,
};

/**
 * Chooses a random number of items from the given array. Can take options that parameterizes this process.
 * @param values The values to choose random items from.
 * @param options (Optional) Options how to choose the items.
 * @param attachedFns An arbitrary number of attached functions to manipulate the property's value.
 */
export function someOf(
  values: any[],
  options?: SomeOfOptions | AttachedFn,
  ...attachedFns: AttachedFn[]
) {
  const { args, attached } = sortArgsByType({ options, attachedFns });

  function someOfImpl(): any[] {
    args.options = {
      ...someOfDefaultOpts,
      ...args.options,
    };

    const min = args.options?.minItems ?? 0;
    const max = args.options?.maxItems ?? values.length;
    const result = randomItems(values, min, max, args.options?.allowDuplicates ?? true);

    return cloneItems(result);
  }

  const valueFn = createValueFn(someOfImpl);
  return createBuildable(valueFn, attached);
}
