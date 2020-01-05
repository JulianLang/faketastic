import { ObjectTreeNode } from 'treelike';
import { randomInt } from '../../factories';
import { findAnchestor, isUndefined } from '../../util';
import { CouldNotFindRootTemplateError } from '../errors';
import { RecursionRootSymbol } from '../itself';

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

  let targetDepth = randomInt(min, max);

  return (node: ObjectTreeNode) => {
    if (targetDepth === 0) {
      return { endWithValue };
    }

    const rootNode = findRecursionRoot(node);
    const currentDepth = getDistance(node, rootNode);

    return currentDepth > targetDepth ? { endWithValue } : { continue: true };
  };
}

function getDistance(node: ObjectTreeNode, rootNode: ObjectTreeNode) {
  let currentDepth = 0;
  let currentNode = node;

  while (currentNode.parent && currentNode !== rootNode) {
    currentDepth++;
    currentNode = currentNode.parent;
  }

  return currentDepth;
}

function findRecursionRoot(node: ObjectTreeNode) {
  const rootNode = findAnchestor(RecursionRootSymbol, node, node.name);

  if (isUndefined(rootNode)) {
    throw new Error(CouldNotFindRootTemplateError);
  }

  return rootNode;
}
