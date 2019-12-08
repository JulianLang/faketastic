import { ObjectTreeNode } from 'treelike';
import { randomInt } from '../../core';

/**
 * Recursion iterator terminating a recursion when it reached a random depth being in a specified range.
 * @param min The minimal depth level.
 * @param max The maximal depth level.
 */
export function RecursionDepth(min = 1, max = 10) {
  let isInit = true;
  let rootNode: ObjectTreeNode;
  let targetDepth = randomInt(min, max);

  return (node: ObjectTreeNode) => {
    if (isInit) {
      rootNode = node;
      isInit = false;
    }

    let currentDepth = 0;
    let currentNode = node;

    while (currentNode.parent && currentNode !== rootNode) {
      currentDepth++;
      currentNode = currentNode.parent;
    }

    const shouldBreakRecursion = currentDepth > targetDepth;

    return shouldBreakRecursion ? { endWithValue: [] } : { continue: true };
  };
}
