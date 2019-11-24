import { ObjectTreeNode } from 'treelike';
import { createProcessorFn, probability, ProcessorFn } from '../core';

export function canBe<T>(value: T, likelyhood = 0.5): ProcessorFn {
  return createProcessorFn(canBeImpl, 'preprocessor');

  function canBeImpl(node: ObjectTreeNode) {
    // never apply
    if (likelyhood === 0) {
      return;
    }

    const alwaysApply = likelyhood === 1;
    const shouldApply = alwaysApply || probability(likelyhood);

    if (shouldApply) {
      // remove children as they are irrelevant due to setting the value:
      node.children = [];
      node.value = value;
    }
  }
}
