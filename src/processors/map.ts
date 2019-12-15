import { ObjectTreeNode } from 'treelike';
import { MutatingFnOrders } from '../constants/mutating-function.orders';
import { FnCalledSymbol, unwrapIfBuildable } from '../core';
import { setSymbol } from '../util';
import { ProcessorFn } from './types';
import { createProcessorFn } from './util';

export function map<T = any, K = any>(mapFn: (param: T, node?: ObjectTreeNode) => K): ProcessorFn {
  return createProcessorFn(mapImpl, 'finalizer', MutatingFnOrders.processors.map);

  function mapImpl(node: ObjectTreeNode) {
    const bareValue = unwrapIfBuildable(node.value);
    const mapped = mapFn(bareValue, node);
    node.value = mapped;

    setSymbol(FnCalledSymbol, mapImpl);
  }
}
