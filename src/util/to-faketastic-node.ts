import { nodeTypeOf, ObjectTreeNode, ObjectTreeNodeType, treeOf } from 'treelike';
import { isBuildable } from '../buildable';
import { getRawValue } from '../builder/traverser';
import { Type, Types } from '../constants';
import { FaketasticNode } from '../types';
import { isDefined } from './is-defined';
import { isType } from './symbols';

export function toFaketasticNode(node: ObjectTreeNode): FaketasticNode {
  if (!isDefined(node)) {
    throw new Error(
      `faketastic: toFaketasticNode: cannot convert "${node}" into a faketastic-node.`,
    );
  }

  const faketasticNode = {
    [Type]: Types.FaketasticNode,
    ...node,
    children: toFaketasticNodes(node.children),
  } as FaketasticNode;

  updateChildrensParent(faketasticNode);
  faketasticNode.isBuildable = () => isBuildable(faketasticNode.value);
  faketasticNode.isContainer = () => isContainer(faketasticNode);
  faketasticNode.getValue = () => getValue(faketasticNode);
  faketasticNode.currentType = () => currentTypeOf(faketasticNode);
  faketasticNode.setValue = (value: any) => setValue(value, faketasticNode);
  faketasticNode.isRefDependent = () => isRefDependent(faketasticNode);

  return faketasticNode;
}

function updateChildrensParent(faketasticNode: FaketasticNode<any>) {
  faketasticNode.children.forEach(child => {
    child.parent = faketasticNode;
  });
}

function toFaketasticNodes(nodes: ObjectTreeNode[]): FaketasticNode[] {
  return nodes.map(child => toFaketasticNode(child)) as FaketasticNode[];
}

function currentTypeOf(node: ObjectTreeNode): ObjectTreeNodeType {
  const significantValue = getRawValue(node.value);
  return nodeTypeOf(significantValue);
}

function isContainer(node: ObjectTreeNode): boolean {
  return isBuildable(node.value) && isBuildable(node.value.value);
}

function setValue(value: any, node: FaketasticNode) {
  const childTree = treeOf(value, getRawValue);
  const faketasticTree = toFaketasticNode(childTree);

  node.children = faketasticTree.children;
  updateChildrensParent(node);
  node.value = value;

  const rawValue = getRawValue(value);
  node.type = nodeTypeOf(rawValue);
}

function getValue(node: FaketasticNode): any {
  let result: any;

  if (node.currentType() === 'value') {
    result = node.value;
  } else {
    result = computeValue(node);
  }

  return result;
}

function computeValue(node: FaketasticNode): any {
  return node.type === 'array' ? fromArray(node) : fromObject(node);
}

function fromArray(node: FaketasticNode): any[] {
  const value: any[] = [];

  for (const child of node.children) {
    value.push(child.getValue());
  }

  return value;
}

function fromObject(node: FaketasticNode): any {
  const value: any = {};

  for (const child of node.children) {
    const name = child.name;
    value[name] = child.getValue();
  }

  return value;
}

function isRefDependent(node: FaketasticNode) {
  const rawValue = getRawValue(node.value);
  const hasRefFn = isType(Types.ReferenceFn, rawValue);
  const isRefFnParent = isType(Types.ReferenceDependent, node);

  return hasRefFn || isRefFnParent;
}
