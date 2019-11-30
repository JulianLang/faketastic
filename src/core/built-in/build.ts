import { nodeTypeOf, ObjectTreeNode, treeOf } from 'treelike';
import { isUndefined } from '../../util';
import { Buildable, ProcessorFn, ProcessorOrderSymbol } from '../types';
import { ProcessorType } from '../types/processor.types';
import { isBuildable, isBuilderFunction, isProcessorFn } from '../util';

/**
 * Builds a buildable and outputs the generated mock data. The amount of objects
 * being built can be configured via the second parameter.
 * @param buildable An object of interface Buildable that should get built.
 * @param quantity The amount of mock data objects that should be generated from the buildable.
 */
export function build<T, R = any>(buildable: Buildable<T>, ...processors: ProcessorFn[]): R {
  buildable.processors.push(...processors);
  const buildableNode = treeOf(buildable, childSelector);

  traverse(buildableNode, node => runProcessors('initializer', node));
  traverse(buildableNode, node => runProcessors('preprocessor', node));
  traverse(buildableNode, node => buildNode(node));
  traverse(buildableNode, node => runProcessors('postprocessor', node));
  traverse(buildableNode, node => runProcessors('finalizer', node));

  updateType(buildableNode);

  if (buildableNode.children.length > 0) {
    switch (buildableNode.type) {
      case 'array':
        buildableNode.value = [] as any;
        break;
      case 'object':
        buildableNode.value = {} as any;
        break;
    }

    buildChildrenOf(buildableNode);
  }

  if (isBuildable(buildableNode.value)) {
    buildableNode.value = getLeafBuildable(buildableNode.value);
  }

  return buildableNode.value as any;
}

/**
 * Builds a node by replacing its value with an empty object or array (depending on node type)
 * and assigning its children's values to the object / array as either properties or items.
 * @param node The node to build its children.
 */
function buildChildrenOf(node: ObjectTreeNode) {
  for (const child of node.children) {
    // we want the leaf value here, as it is the actual/build value
    let value = getLeafBuildable(child.value);

    // all children must have names
    node.value[child.name!] = value;
  }
}

/**
 * Takes a value that might be a `Buildable` and starts looking for the most nested `Buildable`
 * by recursively checking if the `Buildable.value` is a `Buildable` again.
 * @param value A value that might be a `Buildable` to start searching for nested `Buildable`s.
 */
function getLeafBuildable(value: any) {
  while (isBuildable(value)) {
    value = value.value;
  }

  return value;
}

/**
 * Runs all processor functions of a specified type, being present on a given node.
 * @param type The processor type to run.
 * @param node The node to run its processors.
 */
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

/**
 * Updates the node type of a given node by aligning it to its value type.
 * @param node The node to update its type.
 */
function updateType(node: ObjectTreeNode) {
  const value = getLeafBuildable(node.value);
  node.type = nodeTypeOf(value);
}

/**
 * Builds a node's value if the value is a `Buildable`.
 * @param node The node to build.
 */
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

/**
 * Traverses a tree (top-down), starting from a given node.
 * @param node The node to start traversion from.
 * @param onNext The callback function to call for each node reached.
 */
function traverse<T>(node: ObjectTreeNode<T>, onNext: (node: ObjectTreeNode<T>) => void): void {
  // also include root node:
  if (isUndefined(node.parent)) {
    onNext(node);
  }

  for (const child of node.children) {
    onNext(child);
    traverse(child, onNext);
  }
}

/**
 * Compares two processor functions by its processor order.
 * @param a A processor function as comparison subject.
 * @param b A processor function as comparison object.
 */
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
