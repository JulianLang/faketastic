import { ObjectTreeNode } from 'treelike';
import { isDefined } from '../type-fns/is-defined';
import { hasSymbol } from './has-symbol';

/**
 * Tries to find a specified symbol on the values of the given node's anchestors.
 * @param symbol The symbol to find on an anchestor node's value.
 * @param from The node to start searching from.
 */
export function findAnchestor(
  symbol: symbol,
  from: ObjectTreeNode,
  withValue?: any,
): ObjectTreeNode | undefined {
  let currentNode: ObjectTreeNode | undefined = from.parent;

  while (isDefined(currentNode)) {
    if (hasSymbol(symbol, currentNode, withValue)) {
      break;
    }

    currentNode = currentNode.parent;
  }

  return currentNode;
}
