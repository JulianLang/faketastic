import { childTraverser, findNode, ObjectTreeNode } from 'treelike';
import { isDefined } from '../util';
import { isBuildable } from './is-buildable';

/**
 * Determines whether a given node contains at least one `Buildable` child node. Checks also for nested
 * nodes when an object- or array-node was given as input.
 * @param node The node to check if it contains at least one `Buildable` in its children.
 * @returns `true` if the given value contains at least one `Buildable`, `false` otherwise.
 */
export function containsBuildable(node: ObjectTreeNode): boolean {
  const buildableChildNode = findNode(
    node,
    n => n !== node && isBuildable(n.value),
    childTraverser,
  );

  return isDefined(buildableChildNode);
}
