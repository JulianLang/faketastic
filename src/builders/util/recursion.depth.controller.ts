import { ObjectTreeNode } from 'treelike';
import { randomInt } from '../../core';

/**
 * Recursion iterator terminating a recursion when it reached a random depth being in a specified range.
 * @param min The minimal depth level.
 * @param max The maximal depth level.
 */
export function RecursionDepth(endWithValue: any, min = 1, max = 10) {
  if (min < 0 || max < 0) {
    throw new Error(
      `faketastic: RecursionDepth: Invalid depth range (${min}, ${max}). Depth must not be a negative number.`,
    );
  }

  let isInit = true;
  let rootNode: ObjectTreeNode;
  let targetDepth = randomInt(min, max);

  return (node: ObjectTreeNode) => {
    if (targetDepth === 0) {
      return { endWithValue };
    }
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

    return currentDepth > targetDepth ? { endWithValue } : { continue: true };
  };
}
