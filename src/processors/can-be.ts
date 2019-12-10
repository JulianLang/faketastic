import { ObjectTreeNode } from 'treelike';
import { createProcessorFn, probability } from '../core';
import { Stickiness } from '../types';
import { ProcessorFn } from './types';

export function canBe<T>(value: T, likelyhood = 0.5, sticky: Stickiness = 'sticky'): ProcessorFn {
  return createProcessorFn(canBeImpl, 'preprocessor', 0, sticky);

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
