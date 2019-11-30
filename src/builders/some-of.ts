import { ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  addIfProcessorFn,
  asBuildable,
  build,
  Buildable,
  BuildableSymbol,
  createProcessorFn,
  ProcessorFn,
  randomInt,
  randomItem,
} from '../core';
import { cloneItems, isUndefined } from '../util';
import { SomeOfOpts } from './types';

/**
 * Takes an array of items and picks a random amount of items from it. There are options available to
 * define how (and how many) items should be picked from the given array.
 * @param values The values to pick items from.
 * @param opts Additional options on how (many) items should be picked.
 * @param processors Processors such as `quantity`, `map` or others to apply to this `Buildable`
 */
export function someOf<T>(
  values: T[],
  opts?: SomeOfOpts | ProcessorFn,
  ...processors: ProcessorFn[]
): Buildable<any> {
  const someOfDefaultOpts: SomeOfOpts = {
    allowDuplicates: true,
    minItems: 2,
  };

  if (addIfProcessorFn(opts, processors)) {
    opts = undefined;
  }

  const initSomeOf = createProcessorFn(init, 'preprocessor', ProcessorOrders.treeStructureChanging);

  return {
    [BuildableSymbol]: 'value',
    processors: [initSomeOf, ...processors],
    value: null,
  };

  function init(node: ObjectTreeNode) {
    const content = chooseItems();
    const buildableContent = asBuildable(content);
    const builtContent = build(buildableContent);

    node.type = 'array';
    node.children = [];
    node.value = builtContent;
  }

  function chooseItems(): T[] {
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

    return cloneItems(result);
  }
}
