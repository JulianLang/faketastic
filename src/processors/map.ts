import { ObjectTreeNode } from 'treelike';
import { FunctionOrders } from '../constants/function.orders';
import { createProcessorFn } from '../core';
import { ProcessorFn } from './types';

export function map<T = any, K = any>(mapFn: (param: T, node?: ObjectTreeNode) => K): ProcessorFn {
  return createProcessorFn(mapImpl, 'finalizer', FunctionOrders.processors.map);

  function mapImpl(node: ObjectTreeNode) {
    const mapped = mapFn(node.value, node);
    node.value = mapped;
  }
}
