import { ObjectTreeNode } from 'treelike';
import { hasSymbol } from './has-symbol';
import { isDefined } from './is-defined';

/**
 * Tries to find a specified symbol on the values of the given node's anchestors.
 * @param symbol The symbol to find on an anchestor node's value.
 * @param from The node to start searching from.
 */
export function findAnchestor(symbol: symbol, from: ObjectTreeNode): ObjectTreeNode | undefined {
  let currentNode: ObjectTreeNode | undefined = from.parent;

  while (isDefined(currentNode)) {
    if (hasSymbol(symbol, currentNode)) {
      break;
    }

    currentNode = currentNode.parent;
  }

  return currentNode;
}
