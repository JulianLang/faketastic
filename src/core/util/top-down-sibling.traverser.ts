import { ObjectTreeNode, TraverseCallbackFn } from 'treelike';
import { isUndefined } from 'util';
import { hasSymbol } from '../../util';
import { BuildRootSymbol } from '../types';

/**
 * **For internal use only. This function is not intended to be called from user code and
 * was exported for testing-purposes only.**
 *
 * ---
 *
 * Traverses a tree from top to down by traversing the siblings, like that:
 * ```
 *        (1)
 *      /  |  \
 *    (2) (3) (4)
 *   /    / \
 * (5)  (6)  (7)
 * ```
 * @param node The node to start traversion from. Usually the tree's root.
 * @param onNext The callback function to call for each and every traversed node.
 */
export function topDownSiblingTraverser(node: ObjectTreeNode, onNext: TraverseCallbackFn): void {
  // also include root
  if (hasSymbol(BuildRootSymbol, node) || isUndefined(node.parent)) {
    onNext(node);
  }

  for (const child of node.children) {
    onNext(child);
  }

  for (const child of node.children) {
    topDownSiblingTraverser(child, onNext);
  }
}
