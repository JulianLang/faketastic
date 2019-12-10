import { ObjectTreeNode } from 'treelike';
import { MutatingFnOrders } from '../constants/mutating-function.orders';
import { ProcessorFn } from './types';
import { createProcessorFn } from './util';

export function map<T = any, K = any>(mapFn: (param: T, node?: ObjectTreeNode) => K): ProcessorFn {
  return createProcessorFn(mapImpl, 'finalizer', MutatingFnOrders.processors.map);

  function mapImpl(node: ObjectTreeNode) {
    const mapped = mapFn(node.value, node);
    node.value = mapped;
  }
}
