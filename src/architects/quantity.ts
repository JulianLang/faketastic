import { addChildren, ObjectTreeNode, replace } from 'treelike';
import { ProcessorOrders } from '../constants';
import { createProcessorFn, isBuildable } from '../core';
import { Buildable, IsStickyProcessorSymbol, ProcessorFn, QuantityInsertMode } from '../core/types';
import { Quantity } from '../core/types/quantity';
import { getQuantity } from '../core/util/get-quantity';
import { clone, isUndefined } from '../util';

export function quantity(
  quantity: Quantity = 1,
  insertMode: QuantityInsertMode = 'createNewArray',
) {
  return createProcessorFn(quantityImpl, 'initializer', ProcessorOrders.treeStructureChanging);

  function quantityImpl(node: ObjectTreeNode) {
    if (quantity === 1) {
      // nothing to do
      return;
    }

    let unstickyProcessors: ProcessorFn[] = [];

    if (isBuildable(node.value)) {
      /*
        remove quantity processor from buildable to avoid infinity loop, as otherwise
        the newly created children will apply quantity as well leading to infinity loop.
      */
      removeQuantityProcessor(node.value);
      /**
       * Processors marked as "sticky" will disengage from the original node and stick to
       * the multiplied nodes that represents the actual generated values later on. Unsticky
       * processors will not be transfered to the multiplied value nodes and be kept on original node.
       */
      unstickyProcessors = extractUnstickyProcessors(node);
    }

    const children = multiplyNode(node, quantity);
    modifyTree(children, node);

    if (isBuildable(node.value)) {
      // readd previously removed unsticky processors on the original node:
      node.value.processors = unstickyProcessors;
    }
  }

  function modifyTree(children: ObjectTreeNode<any>[], node: ObjectTreeNode<any>) {
    if (insertMode === 'useParentArray') {
      insertInline(children, node);
    } else {
      node.type = 'array';
      node.value = [];
      node.children = [];
      addChildren(children, node);
    }
  }

  function extractUnstickyProcessors(node: ObjectTreeNode<any>) {
    const unstickyProcessors = getUnstickyProcessors(node);
    removeStickyProcessors(node);

    return unstickyProcessors;
  }

  function removeStickyProcessors(node: ObjectTreeNode<any>) {
    node.value.processors = node.value.processors.filter((processorFn: ProcessorFn) =>
      isUndefined(processorFn[IsStickyProcessorSymbol]),
    );
  }

  function getUnstickyProcessors(node: ObjectTreeNode<any>) {
    return node.value.processors.filter((processorFn: ProcessorFn) =>
      isUndefined(processorFn[IsStickyProcessorSymbol]),
    );
  }

  function multiplyNode(node: ObjectTreeNode, quantity: Quantity): ObjectTreeNode[] {
    const nodes: ObjectTreeNode[] = [];
    const numberOfItems = getQuantity(quantity);

    for (let index = 0; index < numberOfItems; index++) {
      const clonedNode: ObjectTreeNode = clone(node);
      clonedNode.name = index;
      nodes.push(clonedNode);
    }

    return nodes;
  }

  function insertInline(children: ObjectTreeNode[], node: ObjectTreeNode): ObjectTreeNode {
    if (node.parent == null || node.parent.parent == null) {
      throw new Error(`Use quantity's "inline" parameter only on nodes having a grandparent node.`);
    }
    if (node.parent.type !== 'array') {
      throw new Error(`Only use quantity's "inline" parameter on direct children of arrays.`);
    }

    const mergedChildren = merge(node.parent.children, children, node);
    const newParent: ObjectTreeNode = {
      ...node.parent,
      type: 'array',
      value: [],
      children: mergedChildren,
    };

    replace(node.parent, newParent, node.parent.parent);
    mergedChildren.forEach(c => (c.parent = newParent));

    return newParent;
  }

  function merge(
    currentChildren: ObjectTreeNode[],
    newChildren: ObjectTreeNode[],
    quantityBaseNode: ObjectTreeNode,
  ): ObjectTreeNode[] {
    const merged = [...currentChildren, ...newChildren];
    const childrenWithoutBaseNode = merged.filter(n => n !== quantityBaseNode);
    const renamed = renameFromIndex(childrenWithoutBaseNode);

    return renamed;
  }

  function renameFromIndex(nodes: ObjectTreeNode[]): ObjectTreeNode[] {
    nodes.forEach((n, index) => (n.name = index));

    return nodes;
  }

  function removeQuantityProcessor(buildable: Buildable) {
    buildable.processors = buildable.processors.filter(p => p !== quantityImpl);
  }
}
