import { AttachedFn } from '../attached-fns';
import { createBuildable } from '../buildable';
import { cloneItems } from '../util';
import { createValueFn, randomItem } from '../value-fns';

/**
 * Chooses a random item from the given array of items.
 * @param values The values to randomly choose an item from.
 * @param attachedFns An arbitrary number of attached functions to manipulate the property's value.
 */
export function oneOf(values: any[], ...attachedFns: AttachedFn[]) {
  function oneOfImpl() {
    const cloned = cloneItems(values);
    const item = randomItem(cloned);

    return item;
  }

  const valueFn = createValueFn(oneOfImpl);
  return createBuildable(valueFn, attachedFns);
}
