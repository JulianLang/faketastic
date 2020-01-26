import { ObjectTreeNode } from 'treelike';
import { isValueFn } from '../value-fns';

export function buildNode(node: ObjectTreeNode) {
  /*
    node.value can be:
     - static value
     - object/array containing buildables
     - buildable
  */
  if (isValueFn(node.value)) {
    node.value = node.value();
  }
}
