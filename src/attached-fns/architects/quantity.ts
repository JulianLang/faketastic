import { Buildable, createBuildable } from '../../buildable';
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
      const withAttachedFns = addAttachedFns(value);
      const cloned = clone(withAttachedFns);
      result.push(cloned);
    }

    return result;
  }

  /**
   * Adds attached functions to the specified value, if any.
   * @param value The value to add attached functions to.
   */
  function addAttachedFns(value: any): Buildable | any {
    return attachedFns.length > 0 ? createBuildable(value, attachedFns) : value;
  }

  return createArchitectFn(quantityImpl);
}
