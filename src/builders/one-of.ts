import { ObjectTreeNode } from 'treelike';
import { FunctionOrders } from '../constants';
import {
  asBuildable,
  Buildable,
  buildChild,
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
    FunctionOrders.processors.treeStructureChanging,
  );

  return createBuildable(placeholder('oneOf'), [initOneOf, ...attachedFns]);

  function initOneOfImpl(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const buildableContent = asBuildable(content);
    const builtContent = buildChild(buildableContent, node);

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
