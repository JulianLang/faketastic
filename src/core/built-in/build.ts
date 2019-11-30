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
    buildableNode.value = getLeafBuildable(buildableNode);
  }

  return buildableNode.value as any;
}

function buildChildrenOf(node: ObjectTreeNode) {
  for (const child of node.children) {
    let value = getLeafBuildable(child);

    // all children must have names
    node.value[child.name!] = value;
  }
}

function getLeafBuildable(child: ObjectTreeNode<any>) {
  let value = child.value;
  while (isBuildable(value)) {
    value = value.value;
  }
  return value;
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

function updateType(node: ObjectTreeNode) {
  const value = getLeafBuildable(node);
  node.type = nodeTypeOf(value);
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
  // also include root node:
  if (isUndefined(node.parent)) {
    onNext(node);
  }

  for (const child of node.children) {
    onNext(child);
    traverse(child, onNext);
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
