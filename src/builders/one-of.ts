import { copyAttributes, ObjectTreeNode, treeOf } from 'treelike';
import { UnsetValue } from '../constants';
import {
  asBuildable,
  Buildable,
  childSelector,
  createBuildable,
  FnCalledSymbol,
  randomInt,
  reevaluate,
} from '../core';
import { createProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { clone, isBuilt, isDefined, setSymbol } from '../util';

export function oneOf(values: any[], ...attachedFns: AttachedFn[]): Buildable {
  const initOneOf = createProcessorFn(initOneOfImpl, 'initializer');

  return createBuildable(UnsetValue, [initOneOf, ...attachedFns]);

  function initOneOfImpl(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const buildableContent = asBuildable(content);
    node.value = buildableContent;
    node.children = [];

    setSymbol(FnCalledSymbol, initOneOfImpl);

    do {
      // detective.resetChanges();
      // const subTree = treeOf($node.value, childSelector);
      // subTree.parent = $node.parent;
      // subTree.name = $node.name;
      // copyAttributes(subTree, $node);
      // reevaluate($node);

      const subtree = treeOf(node.value, childSelector);
      subtree.parent = node.parent;
      subtree.name = node.name;
      copyAttributes(subtree, node);
      reevaluate(node);
    } while (!isBuilt(node.value, 'initializer'));
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
