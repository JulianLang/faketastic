import { findNode, ObjectTreeNode, siblingAndSelfTraverser } from 'treelike';
import { MutatingFnOrders, UnsetValue } from '../constants';
import { Buildable, createBuildable, isBuildable, unwrapIfBuildable } from '../core';
import { isPlaceholder, placeholder } from '../placeholder';
import { createProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { isDefined, isUndefined } from '../util';
import { isBuilderFunction } from './util';
export function ref<T = any>(property: keyof T, ...attachedFns: AttachedFn[]): Buildable {
  const refProcessor = createProcessorFn(refImpl, 'finalizer', MutatingFnOrders.processors.ref);

  return createBuildable(UnsetValue, [refProcessor, ...attachedFns]);

  function refImpl(node: ObjectTreeNode) {
    const resolvedReference = tryResolveRef(node);

    if (isUndefined(resolvedReference)) {
      console.warn(`faketastic: Could not resolve reference to "${property}"`);
    } else {
      // since we set the value now, children can be removed, as they have no relevance anymore
      node.children = [];
      const bareValue = unwrapIfBuildable(resolvedReference.value);

      // TODO: langju: is "BuilderFn" the only possibility for incomplete values?
      if (isBuilderFunction(bareValue)) {
        // value has not been built yet. mark for recheck in next (outer, if any) build cycle.
        node.value = placeholder(`ref/defer:${property}`, [refProcessor, ...attachedFns]);
      } else {
        node.value = bareValue;
      }
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
    const hasCorrectName = node.name === property;
    const value = isBuildable(node.value) ? node.value.value : node.value;
    const isValue = !isPlaceholder(value);

    return isValue && hasCorrectName;
  }
}
