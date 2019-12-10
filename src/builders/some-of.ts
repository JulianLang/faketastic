import { ObjectTreeNode } from 'treelike';
import { MutatingFnOrders } from '../constants';
import {
  addIfProcessorFn,
  asBuildable,
  Buildable,
  buildChild,
  createBuildable,
  createProcessorFn,
  randomInt,
  randomItem,
} from '../core';
import { placeholder } from '../placeholder';
import { ProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { cloneItems, isUndefined } from '../util';
import { SomeOfOpts } from './types';

/**
 * Takes an array of items and picks a random amount of items from it. There are options available to
 * define how (and how many) items should be picked from the given array.
 * @param values The values to pick items from.
 * @param opts Additional options on how (many) items should be picked.
 * @param attachedFns Processors such as `quantity`, `map` or others to apply to this `Buildable`
 */
export function someOf<T>(
  values: T[],
  opts?: SomeOfOpts | ProcessorFn,
  ...attachedFns: AttachedFn[]
): Buildable<any> {
  const someOfDefaultOpts: SomeOfOpts = {
    allowDuplicates: true,
    minItems: 1,
  };

  if (addIfProcessorFn(opts, attachedFns)) {
    opts = undefined;
  }

  const initSomeOf = createProcessorFn(
    initSomeOfImpl,
    'preprocessor',
    MutatingFnOrders.processors.treeStructureChanging,
  );

  return createBuildable(placeholder(), [initSomeOf, ...attachedFns]);

  function initSomeOfImpl(node: ObjectTreeNode) {
    const content = chooseItems();
    const buildableContent = asBuildable(content);
    const builtContent = buildChild(buildableContent, node);

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
