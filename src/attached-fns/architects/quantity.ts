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
      const cloned = clone(value);
      const withAttachedFns = attachedFns.length > 0 ? asBuildable(cloned, attachedFns) : cloned;
      result.push(withAttachedFns);
    }

    return result;
  }

  return createArchitectFn(quantityImpl);
}
