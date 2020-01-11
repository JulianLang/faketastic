import { ObjectTreeNode } from 'treelike';
import { UnsetValue } from '../constants';
import { asBuildable, Buildable, createBuildable, markFnCalled, rebuild } from '../core';
import { randomInt } from '../factories';
import { createProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { clone, isDefined } from '../util';

export function oneOf(values: any[], ...attachedFns: AttachedFn[]): Buildable {
  const initOneOf = createProcessorFn(initOneOfImpl, 'tree-building', 'unsticky');

  return createBuildable(UnsetValue, [initOneOf, ...attachedFns]);

  function initOneOfImpl(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const buildableContent = asBuildable(content, attachedFns);
    node.value = buildableContent;
    node.children = [];

    markFnCalled(initOneOf, node);
    rebuild(node, 'tree-building');
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
