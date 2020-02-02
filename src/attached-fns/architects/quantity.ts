import { Buildable, createBuildable, isBuildable } from '../../buildable';
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
      const withAttachedFns = addAttachedFns(cloned);
      result.push(withAttachedFns);
    }

    return result;
  }

  /**
   * Adds attached functions to the specified value, if any.
   * @param value The value to add attached functions to.
   */
  function addAttachedFns(value: any): Buildable | any {
    if (attachedFns.length === 0) {
      return value;
    }

    const buildable = isBuildable(value) ? value : createBuildable(value);
    buildable.attachedFns.push(...attachedFns);

    return buildable;
  }

  return createArchitectFn(quantityImpl);
}
