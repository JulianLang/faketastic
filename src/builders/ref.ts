import { findNode, ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import { Buildable, BuildableSymbol, createProcessorFn, isBuildable, ProcessorFn } from '../core';
import { isDefined, isUndefined } from '../util';
export function ref<T = any>(propertyName: keyof T, ...processors: ProcessorFn[]): Buildable<any> {
  const refProcessor = createProcessorFn(refImpl, 'finalizer', ProcessorOrders.ref);

  return {
    [BuildableSymbol]: 'value',
    processors: [refProcessor, ...processors],
    value: null,
  };

  function refImpl(node: ObjectTreeNode) {
    let resolvedReference: ObjectTreeNode | undefined;

    if (isDefined(node.parent)) {
      resolvedReference = findNode(node.parent, n => n.name === propertyName);
    }

    if (isUndefined(resolvedReference)) {
      console.warn(`faketastic: Could not resolve reference to "${propertyName}"`);
    } else {
      node.children = [];
      node.value = isBuildable(resolvedReference.value)
        ? resolvedReference.value.value
        : resolvedReference.value;
    }
  }
}
