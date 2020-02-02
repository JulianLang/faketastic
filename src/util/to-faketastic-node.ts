import { nodeTypeOf, ObjectTreeNode, ObjectTreeNodeType } from 'treelike';
import { isBuildable } from '../buildable';
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

  return faketasticNode;
}

export function toFaketasticNodes(nodes: ObjectTreeNode[]): FaketasticNode[] {
  return nodes.map(toFaketasticNode) as FaketasticNode[];
}

export function currentTypeOf(node: ObjectTreeNode): ObjectTreeNodeType {
  const significantValue = isBuildable(node.value) ? node.value.value : node.value;

  return nodeTypeOf(significantValue);
}

export function isContainer(node: ObjectTreeNode): boolean {
  return isBuildable(node.value) && isBuildable(node.value.value);
}
