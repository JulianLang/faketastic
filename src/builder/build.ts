import { nodeTypeOf, ObjectTreeNode, traverse, treeOf } from 'treelike';
import { AttachedFn } from '../attached-fns';
import { containsBuildable } from '../buildable';
import { isValueFn } from '../value-fns';
import { BuilderFn } from './builder.fn';
import { getRawValue } from './traverser';

export const build: BuilderFn<any> = (input: any, attachedFns: AttachedFn[] = []) => {
  const tree = treeOf(input, getRawValue);

  traverse(tree, node => buildNode(node));
  traverse(tree, node => finalize(node));

  return tree.value;
};

function buildNode(node: ObjectTreeNode) {
  /*
    node.value can be:
     - static value (42, 'str', true, object/array with static values, ...)
     - object/array containing buildables
     - buildable
  */
  if (isValueFn(node.value)) {
    node.value = node.value();
  }

  if (containsBuildable(node.value)) {
    const valueToBuild = getRawValue(node.value);
    node.value = build(valueToBuild);
  }
}

function finalize(node: ObjectTreeNode): void {
  const value = getRawValue(node.value);
  setValue(value, node);

  // value nodes must not have any children
  if (node.type !== 'value') {
    buildChildren(node);
  }
}

function buildChildren(node: ObjectTreeNode) {
  for (const child of node.children) {
    // all children must have names
    node.value[child.name!] = child.value;
  }
}

function setValue(value: any, node: ObjectTreeNode) {
  node.value = value;
  node.type = nodeTypeOf(node.value);
}
