import { nodeTypeOf, ObjectTreeNode, ObjectTreeNodeType, treeOf } from 'treelike';
import { isBuildable } from '../buildable';
import { getRawValue } from '../builder/traverser';
import { Type, Types } from '../constants';
import { FaketasticNode } from '../types';
import { isDefined } from './is-defined';

export function toFaketasticNode(node?: ObjectTreeNode): FaketasticNode | undefined {
  if (!isDefined(node)) {
    return node;
  }

  const faketasticNode = {
    [Type]: Types.FaketasticNode,
    ...node,
    children: toFaketasticNodes(node.children),
  } as FaketasticNode;

  faketasticNode.isBuildable = () => isBuildable(faketasticNode.value);
  faketasticNode.isContainer = () => isContainer(faketasticNode);
  faketasticNode.currentValue = () => faketasticNode.value;
  faketasticNode.currentType = () => currentTypeOf(faketasticNode);
  faketasticNode.setValue = (value: any) => setValue(value, faketasticNode);

  return faketasticNode;
}

function toFaketasticNodes(nodes: ObjectTreeNode[]): FaketasticNode[] {
  return nodes.map(toFaketasticNode) as FaketasticNode[];
}

function currentTypeOf(node: ObjectTreeNode): ObjectTreeNodeType {
  const significantValue = isBuildable(node.value) ? node.value.value : node.value;

  return nodeTypeOf(significantValue);
}

function isContainer(node: ObjectTreeNode): boolean {
  return isBuildable(node.value) && isBuildable(node.value.value);
}

function setValue(value: any, node: FaketasticNode) {
  const childTree = treeOf(value, getRawValue);
  const faketasticTree = toFaketasticNode(childTree)!;

  node.children = faketasticTree.children;
  node.value = value;
  node.type = nodeTypeOf(node.value);
}
