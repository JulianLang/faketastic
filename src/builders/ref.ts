import { findNode, ObjectTreeNode, siblingAndSelfTraverser } from 'treelike';
import { ProcessorOrders } from '../constants';
import { Buildable, BuildableSymbol, createProcessorFn, isBuildable, ProcessorFn } from '../core';
import { isPlaceholder } from '../placeholder';
import { isDefined, isUndefined } from '../util';
export function ref<T = any>(propertyName: keyof T, ...processors: ProcessorFn[]): Buildable<any> {
  const refProcessor = createProcessorFn(refImpl, 'finalizer', ProcessorOrders.ref);

  return {
    [BuildableSymbol]: 'value',
    processors: [refProcessor, ...processors],
    value: null,
  };

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
      resolvedReference = findNode(
        currentNode,
        n => !isPlaceholder(n) && n.name === propertyName,
        siblingAndSelfTraverser,
      );

      currentNode = currentNode.parent;
    }

    return resolvedReference;
  }
}
