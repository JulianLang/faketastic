import { ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants/processor.orders';
import { createProcessorFn, ProcessorFn } from '../core';

export function map<T = any, K = any>(mapFn: (param: T) => K): ProcessorFn {
  return createProcessorFn(mapImpl, 'finalizer', ProcessorOrders.map);

  function mapImpl(node: ObjectTreeNode) {
    const mapped = mapFn(node.value);
    node.value = mapped;
  }
}
