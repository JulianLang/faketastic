import { findNode, ObjectTreeNode, siblingAndSelfTraverser } from 'treelike';
import { FunctionOrders } from '../constants';
import { Buildable, createBuildable, createProcessorFn, isBuildable } from '../core';
import { isPlaceholder, placeholder } from '../placeholder';
import { AttachedFn } from '../types';
import { isDefined, isUndefined } from '../util';
export function ref<T = any>(propertyName: keyof T, ...attachedFns: AttachedFn[]): Buildable<any> {
  const refProcessor = createProcessorFn(refImpl, 'finalizer', FunctionOrders.processors.ref);

  return createBuildable(placeholder(`ref:${propertyName}`), [refProcessor, ...attachedFns]);

  function refImpl(node: ObjectTreeNode) {
    const resolvedReference = tryResolveRef(node);

    if (isUndefined(resolvedReference)) {
      console.warn(`faketastic: Could not resolve reference to "${propertyName}"`);
    } else {
      // since we set the value now, children can be removed, as they have no relevance anymore
      node.children = [];
      node.value = isBuildable(resolvedReference.value)
        ? resolvedReference.value.value
        : resolvedReference.value;
    }
  }

  function tryResolveRef(node: ObjectTreeNode<any>): ObjectTreeNode<any> | undefined {
    let resolvedReference: ObjectTreeNode | undefined;
    let currentNode: ObjectTreeNode | undefined = node;

    while (isUndefined(resolvedReference) && isDefined(currentNode)) {
      resolvedReference = findNode(currentNode, n => isMatch(n), siblingAndSelfTraverser);

      currentNode = currentNode.parent;
    }

    return resolvedReference;
  }

  function isMatch(node: ObjectTreeNode) {
    const hasCorrectName = node.name === propertyName;
    const value = isBuildable(node.value) ? node.value.value : node.value;
    const isValue = !isPlaceholder(value);

    return isValue && hasCorrectName;
  }
}
