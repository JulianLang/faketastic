import { findNode, ObjectTreeNode, siblingAndSelfWithChildrenTraverser } from 'treelike';
import { UnsetValue } from '../constants';
import { Buildable, createBuildable, isBuildable, markFnCalled, unwrapIfBuildable } from '../core';
import { createPlaceholder, isPlaceholder } from '../placeholder';
import { createProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { isDefined, isUndefined } from '../util';
import { isValueFunction } from '../value-fns/util';

export function ref<T = any>(property: keyof T, ...attachedFns: AttachedFn[]): Buildable {
  const refProcessor = createProcessorFn(refImpl, 'finalizer', 'sticky');

  return createBuildable(UnsetValue, [refProcessor, ...attachedFns]);

  function refImpl(node: ObjectTreeNode) {
    const resolvedReference = tryResolveRef(node);
    if (isUndefined(resolvedReference)) {
      return;
    }

    // since we set the value now, ensure children are removed, as they have no relevance anyways
    node.children = [];
    const bareValue = unwrapIfBuildable(resolvedReference.value);

    if (isValueFunction(bareValue) || bareValue === UnsetValue) {
      // value has not been built yet. mark for recheck after build cycle.
      node.value = createPlaceholder(`ref/defer`, {}, [refProcessor, ...attachedFns]);
    } else if (!isPlaceholder(bareValue)) {
      node.value = bareValue;
      markFnCalled(refImpl, node);
    }
  }

  function tryResolveRef(node: ObjectTreeNode<any>): ObjectTreeNode<any> | undefined {
    let resolvedReference: ObjectTreeNode | undefined;
    let currentNode: ObjectTreeNode | undefined = node;

    while (isUndefined(resolvedReference) && isDefined(currentNode)) {
      resolvedReference = findNode(
        currentNode,
        n => isMatch(n),
        siblingAndSelfWithChildrenTraverser,
      );

      currentNode = currentNode.parent;
    }

    return resolvedReference;
  }

  function isMatch(node: ObjectTreeNode) {
    const hasCorrectName = node.name === property;
    const value = isBuildable(node.value) ? node.value.value : node.value;
    const isValue = !isPlaceholder(value) && value !== UnsetValue;

    return isValue && hasCorrectName;
  }
}
