import {
  Buildable,
  BuildableSymbol,
  BuilderFn,
  createBuilderFn,
  ProcessorFn,
  randomInt,
  randomItem,
} from '../core';
import { isUndefined } from '../util';
import { SomeOfOpts } from './types';

export function someOf<T>(
  values: T[],
  opts?: SomeOfOpts,
  ...processors: ProcessorFn[]
): Buildable<BuilderFn<T[]>> {
  const someOfBuilder = createBuilderFn<T[]>(someOfImpl);
  const someOfDefaultOpts: SomeOfOpts = {
    allowDuplicates: true,
    minItems: 2,
  };

  return {
    [BuildableSymbol]: 'value',
    processors,
    value: someOfBuilder,
  };

  function someOfImpl(): T[] {
    if (isUndefined(opts)) {
      opts = someOfDefaultOpts;
    }

    opts = {
      ...someOfDefaultOpts,
      ...opts,
    };

    const result: T[] = [];
    const min = opts.minItems || 0;
    const max = opts.maxItems || values.length;

    if (values.length === 0) {
      throw new Error(`faketastic: "someOf" can only operate on non-empty arrays.`);
    }
    if (min > values.length && !opts.allowDuplicates) {
      throw new Error(
        `faketastic: Options for "someOf" are impossible to meet as "minItems" > "values.length" and` +
          `duplicates are not allowed in results.`,
      );
    }
    if (min > max) {
      throw new Error(
        `faketastic: Options for "someOf" are impossible to meet as "minItems" (${min})` +
          `is greater than "maxItems" (${max}).`,
      );
    }

    const targetItemCount = randomInt(min, max);

    for (let i = 0; i < targetItemCount; i++) {
      /*
        variable "item" cannot be null here, as "randomItem" will only return null if the given
        values array has no items. However, this is impossible since the array's size gets
        checked in the code above and if the array is empty, an error is thrown.

        Thus the ! operator behind randomItem is correct and safe to use.
      */
      const item = randomItem(values)!;

      if (opts.allowDuplicates || !result.includes(item)) {
        result.push(item);
      } else {
        // try again:
        i--;
      }
    }

    return result;
  }
}
