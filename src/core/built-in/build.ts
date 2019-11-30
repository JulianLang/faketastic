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
export function build<T>(buildable: Buildable<T>, ...processors: ProcessorFn[]): any {
  buildable.processors.push(...processors);
  const root = treeOf(buildable, childSelector);

  traverse(root, node => runProcessors('initializer', node));
  traverse(root, node => runProcessors('preprocessor', node));
  traverse(root, node => buildNode(node));
  traverse(root, node => runProcessors('postprocessor', node));
  traverse(root, node => runProcessors('finalizer', node));
  traverse(root, node => finalize(node));

  return root.value;
}

function finalize(node: ObjectTreeNode): void {
  let value = node.value;

  // buildable has value property which holds the actual built value.
  // However, this value can again be a buildable, until a leaf of the tree is reached
  while (isBuildable(value)) {
    value = value.value;
  }

  setValue(value, node);

  // value nodes must not have any children
  if (node.type !== 'value') {
    buildChildrenOf(node);
  }
}

function buildChildrenOf(node: ObjectTreeNode) {
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
