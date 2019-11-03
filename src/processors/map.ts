import { ObjectTreeNode } from 'object-tree';
import { ProcessorPriorities } from '../constants/processor.priorities';
import { createProcessorFn, ProcessorFn } from '../core';

export function map<T = any, K = any>(mapFn: (param: T) => K): ProcessorFn {
  return createProcessorFn(mapImpl, 'finalizer', ProcessorPriorities.map);

  function mapImpl(node: ObjectTreeNode) {
    console.log(node);
  }
}
