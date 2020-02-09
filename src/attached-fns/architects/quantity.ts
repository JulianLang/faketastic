import { asBuildable } from '../../buildable';
import { clone } from '../../util';
import { AttachedFn } from '../attached.fn';
import { Quantity } from '../quantity';
import { createArchitectFn } from '../util/create-architect.fn';
import { resolveQuantity } from '../util/resolve-quantity';

export function quantity(n: Quantity, ...attachedFns: AttachedFn[]): any {
  function quantityImpl(value: any) {
    const result: any[] = [];
    const amount = resolveQuantity(n);

    for (let i = 0; i < amount; i++) {
      // functions cannot be cloned, so skip them. https://lodash.com/docs/4.17.15#clone
      const cloned = typeof value === 'function' ? value : clone(value);
      const withAttachedFns = attachedFns.length > 0 ? asBuildable(cloned, attachedFns) : cloned;
      result.push(withAttachedFns);
    }

    return result;
  }

  return createArchitectFn(quantityImpl);
}
