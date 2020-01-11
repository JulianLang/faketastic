import { addChildren, ObjectTreeNode } from 'treelike';
import { asBuildable, Buildable, FnIsStickySymbol, isBuildable, markFnCalled } from '../core';
import { ProcessorFn } from '../processors';
import { clone, extractFns, hasSymbol } from '../util';
import { ArchitectFn, Quantity, QuantityInsertMode } from './types';
import { createArchitectFn, getQuantity } from './util';

export function quantity(
  quantity: Quantity = 1,
  insertMode: QuantityInsertMode = 'createNewArray',
): ArchitectFn {
  // Architects are executed before BuildCycle 'tree-building'
  return createArchitectFn(quantityImpl, 'tree-building');

  function quantityImpl(node: ObjectTreeNode) {
    if (quantity === 1) {
      // nothing to do
      return;
    }

    let stickyProcessors: ProcessorFn[] = [];

    if (isBuildable(node.value)) {
      /*
        remove quantity ArchitectFn from buildable to avoid infinity loop, as otherwise
        the newly created children will apply quantity as well leading to infinity loop.
      */
      removeQuantityArchitect(node.value);
      /*
        Processors marked as "sticky" will stick to the original node and won't be transferred to
        the multiplied nodes that represents the actual generated values later on. Unsticky
        processors will not be transfered to the multiplied value nodes and be kept on original node.
       */
      stickyProcessors = extractStickyProcessors(node.value);
    }

    const children = multiplyNode(node, quantity);
    const buildable = modifyTree(children, node);

    // replace unsticky processors with sticky ones:
    buildable.processors = stickyProcessors;

    markFnCalled(quantityImpl, node);
  }

  function modifyTree(children: ObjectTreeNode<any>[], node: ObjectTreeNode<any>): Buildable {
    if (insertMode === 'useParentArray') {
      insertInline(children, node);
    } else {
      node.value = [];
      node.type = 'array';
      node.children = [];

      addChildren(children, node);
    }

    // keep value as Buildable, so that previously removed, sticky processors
    // can be readded to that Buildable:
    node.value = asBuildable(node.value);
    return node.value;
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

  function insertInline(children: ObjectTreeNode[], node: ObjectTreeNode): void {
    if (node.parent == null) {
      throw new Error(`Use quantity's "inline" parameter only on nodes having a parent node.`);
    }
    if (node.parent.type !== 'array') {
      throw new Error(`Only use quantity's "inline" parameter on direct children of arrays.`);
    }

    const mergedChildren = merge(node.parent.children, children, node);
    node.parent.children = [];
    addChildren(mergedChildren, node.parent);
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

  /**
   * Finds, removes and returns sticky ProcessorFns being present on a given Buildable.
   * @param buildable The Buildable to extract sticky ProcessorFns from.
   */
  function extractStickyProcessors(buildable: Buildable): ProcessorFn[] {
    const stickyProcessors = extractFns(FnIsStickySymbol, buildable.processors) as ProcessorFn[];

    buildable.processors = buildable.processors.filter(p => !hasSymbol(FnIsStickySymbol, p));

    return stickyProcessors;
  }

  function removeQuantityArchitect(buildable: Buildable) {
    buildable.architects = buildable.architects.filter(p => p !== quantityImpl);
  }
}
