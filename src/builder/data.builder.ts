import { nodeTypeOf, ObjectTreeNode, traverse, treeOf } from 'treelike';
import { containsBuildable } from '../buildable';
import { AttachedFn } from '../types';
import { isDefined } from '../util';
import { isValueFn } from '../value-fns';
import { BuilderFn } from './builder.fn';
import { getRawValue } from './traverser';

export const buildData: BuilderFn<any> = (input: any, attachedFns: AttachedFn[] = []) => {
  const tree = treeOf(input, getRawValue);

  traverse(tree, node => buildNode(node));
  traverse(tree, node => finalize(node));

  return tree.value;
};

function buildNode(node: ObjectTreeNode) {
  buildValue(node);

  if (containsBuildable(node.value)) {
    node.value = buildData(node.value);
  }
}

function buildValue(node: ObjectTreeNode) {
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

function finalize(node: ObjectTreeNode): void {
  const value = getRawValue(node.value);
  setValue(value, node);

  // value nodes must not have any children
  if (node.type !== 'value') {
    buildChildren(node);
  }
}

function buildChildren(node: ObjectTreeNode) {
  // if node's value has been already defined, no initialization neccessary
  if (!isDefined(node.value)) {
    switch (node.type) {
      case 'array':
        node.value = [];
        break;
      case 'object':
        node.value = {};
        break;
    }
  }

  for (const child of node.children) {
    // all children must have names
    node.value[child.name!] = child.value;
  }
}

function setValue(value: any, node: ObjectTreeNode) {
  node.value = value;
  node.type = nodeTypeOf(node.value);
}
