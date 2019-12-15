import { ObjectTreeNode } from 'treelike';
import { UnsetValue } from '../constants';
import {
  asBuildable,
  Buildable,
  createBuildable,
  FnCalledSymbol,
  randomInt,
  rebuild,
} from '../core';
import { createProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { clone, isDefined, setSymbol } from '../util';

export function oneOf(values: any[], ...attachedFns: AttachedFn[]): Buildable {
  const initOneOf = createProcessorFn(initOneOfImpl, 'initializer');

  return createBuildable(UnsetValue, [initOneOf, ...attachedFns]);

  function initOneOfImpl(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const buildableContent = asBuildable(content);
    node.value = buildableContent;
    node.children = [];

    setSymbol(FnCalledSymbol, initOneOfImpl);
    rebuild(node, 'initializer');
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
