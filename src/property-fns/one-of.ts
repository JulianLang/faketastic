import { AttachedFn } from '../attached-fns';
import { createBuildable } from '../buildable';
import { cloneItems } from '../util';
import { createValueFn, randomItem } from '../value-fns';

export function oneOf(values: any[], ...attachedFns: AttachedFn[]) {
  function oneOfImpl() {
    const cloned = cloneItems(values);
    const item = randomItem(cloned);

    return item;
  }

  const valueFn = createValueFn(oneOfImpl);
  return createBuildable(valueFn, attachedFns);
}
