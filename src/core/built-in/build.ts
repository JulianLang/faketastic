import { nodeTypeOf, ObjectTreeNode, treeOf } from 'treelike';
import { isDefined, isUndefined } from '../../util';
import { Buildable, ProcessorFn, ProcessorOrderSymbol } from '../types';
import { ProcessorType } from '../types/processor.types';
import { Quantity } from '../types/quantity';
import { clone, isBuildable, isBuilderFunction, isProcessorFn } from '../util';
import { getQuantity } from '../util/get-quantity';

const dynamicRootIdentifier = '$dynamic-root';

/**
 * Builds a buildable and outputs the generated mock data. The amount of objects
 * being built can be configured via the second parameter.
 * @param buildable An object of interface Buildable that should get built.
 * @param quantity The amount of mock data objects that should be generated from the buildable.
 */
export function build<T>(buildable: Buildable<T>, quantity: Quantity = 1): any {
  let count = getQuantity(quantity);

  return quantity === 1 ? buildInstance(buildable) : buildMultiple(buildable, count);
}

function buildMultiple<T>(buildable: Buildable<T>, count: number): any {
  const result = [];

  for (let i = 0; i < count; i++) {
    const buildableClone = clone(buildable);
    const instance = buildInstance<T>(buildableClone);
    result.push(instance);
  }

  return result;
}

function buildInstance<T>(buildable: Buildable<T>) {
  let root = treeOf(buildable, childSelector);

  traverse(root, node => runProcessors('initializer', node));
  /*
    because processors are allowed to alter the tree dynamically,
    we reevaluate the root node after each and every processor cycle.
  */
  root = tryFindRoot(root);
  traverse(root, node => runProcessors('preprocessor', node));
  root = tryFindRoot(root);
  traverse(root, node => buildNode(node));
  root = tryFindRoot(root);
  traverse(root, node => runProcessors('postprocessor', node));
  root = tryFindRoot(root);
  traverse(root, node => runProcessors('finalizer', node));
  root = tryFindRoot(root);
  traverse(root, node => finalize(node));

  return root.value;
}

function tryFindRoot(assumedRoot: ObjectTreeNode): ObjectTreeNode {
  let realRoot: ObjectTreeNode = assumedRoot;

  while (isDefined(assumedRoot.parent)) {
    realRoot = assumedRoot.parent;
  }

  return realRoot;
}

function finalize(node: ObjectTreeNode): void {
  let value = node.value;

  // buildable has value property which holds the actual built value.
  // However, this value can again be a buildable, until a leaf of the tree is reached
  while (isBuildable(value)) {
    value = value.value;
  }

  setValue(value, node);
  buildObjectFromChildrenOf(node);
}

function buildObjectFromChildrenOf(node: ObjectTreeNode) {
  // if node's value has been already defined, no initialization neccessary
  if (isUndefined(node.value)) {
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

function runProcessors(type: ProcessorType, node: ObjectTreeNode): void {
  if (isBuildable(node.value)) {
    const buildable: Buildable = node.value;
    buildable.processors
      .filter(fn => isProcessorFn(fn, type))
      .sort(sortByOrderNumber)
      .forEach(processorFn => {
        processorFn(node);
        updateType(node);
      });
  }
}

function setValue(value: any, node: ObjectTreeNode) {
  node.value = value;
  updateType(node);
}

function updateType(node: ObjectTreeNode) {
  node.type = nodeTypeOf(node.value);
}

function buildNode(node: ObjectTreeNode): void {
  if (!isBuildable(node.value)) {
    return;
  }

  const buildable = node.value;

  if (isBuilderFunction(buildable.value)) {
    const builderFn = buildable.value;
    buildable.value = builderFn();
  }
}

function traverse<T>(node: ObjectTreeNode<T>, onNext: (node: ObjectTreeNode<T>) => void): void {
  for (const child of node.children) {
    traverse(child, onNext);
    onNext(child);
  }

  // TODO: langju: the naming-criteria is too arbitrary, think of other marker for being a root node of a dynamic template
  const isRootNode = !isDefined(node.parent) || node.name === dynamicRootIdentifier;
  if (isRootNode) {
    onNext(node);
  }
}

function sortByOrderNumber(a: ProcessorFn, b: ProcessorFn): number {
  let result = 0;
  const orderA = a[ProcessorOrderSymbol];
  const orderB = b[ProcessorOrderSymbol];

  if (orderA > orderB) {
    result = 1;
  } else if (orderA < orderB) {
    result = -1;
  }

  return result;
}

/**
 * Selects (sub-)properties that should get converted into children nodes of type `ObjectTreeNode`.
 * @param input The read value that gets converted to ObjectTreeNode
 */
export function childSelector(input: any): any {
  let value = input;

  while (isBuildable(value)) {
    value = value.value;
  }

  return value;
}
