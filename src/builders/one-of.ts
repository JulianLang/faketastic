import { ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  asBuildable,
  build,
  Buildable,
  createBuildable,
  createProcessorFn,
  randomInt,
} from '../core';
import { placeholder } from '../placeholder';
import { AttachedFn } from '../types';
import { clone, isDefined } from '../util';

export function oneOf(values: any[], ...attachedFns: AttachedFn[]): Buildable<any> {
  const initOneOf = createProcessorFn(
    initOneOfImpl,
    'preprocessor',
    ProcessorOrders.treeStructureChanging,
  );

  return createBuildable(placeholder(), [initOneOf, ...attachedFns]);

  function initOneOfImpl(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const buildableContent = asBuildable(content);
    const builtContent = build(buildableContent);

    node.value = builtContent;
  }

  function chooseRandomItem() {
    if (!isDefined(values)) {
      throw new Error(
        'Cannot get "oneOf(undefined, …)". First parameter of "oneOf" function must not be null or undefined, but an array.',
      );
    }

    const index = randomInt(0, values.length - 1);
    const clonedValue = clone(values[index]);

    return clonedValue;
  }
}
