import { nodeTypeOf, ObjectTreeNode, treeOf } from 'object-tree';
import { Buildable, PrioritySymbol, ProcessorFn } from '../types';
import { ProcessorType } from '../types/processor.types';
import { Quantity } from '../types/quantity';
import { clone, isBuildable, isBuilderFunction, isDefined, isProcessorFn } from '../util';
import { getQuantity } from '../util/get-quantity';

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

/**
 * Builds a `Buildable` (a.k.a. "template") that got dynamically added to the object-tree
 * by a `BuilderFn` for example. The built value will than be assigned to the given `ObjectTreeNode`
 * as the new host.
 *
 * `BuilderFn`, like `oneOf`, can not only return static values like strings or numbers,
 * but also again `Buildable`s that define templates for example. This behavior enables the
 * user to randomly select templates.
 *
 * Example:
 * ```ts
 * const Person = template({
 *   // template is randomly chosen.
 *   pet: oneOf([DogTemplate, CatTemplate]),
 * });
 * ```
 * @param buildable The buildable that got dynamically added to the tree by a builder function
 * @param hostNode The node which will become the new host to the template
 */
export function buildDynamicTemplate(
  buildable: Buildable<any>,
  hostNode: ObjectTreeNode<any>,
): void {
  const dynamicTemplate = clone(buildable.value);
  const dynamicTemplateBuilt = buildInstance(dynamicTemplate);
  setValue(dynamicTemplateBuilt, hostNode);
}

function buildInstance<T>(buildable: Buildable<T>) {
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
  buildObjectFromChildrenOf(node);
}

function buildObjectFromChildrenOf(node: ObjectTreeNode) {
  // if node's value has been already defined, no initialization neccessary
  if (node.value === undefined) {
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
      .sort(sortDescendingByPriority)
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

  if (isBuildable(buildable.value)) {
    buildDynamicTemplate(buildable, node);
  }
}

function traverse<T>(node: ObjectTreeNode<T>, onNext: (node: ObjectTreeNode<T>) => void): void {
  for (const child of node.children) {
    traverse(child, onNext);
    onNext(child);
  }

  const isRootNode = !isDefined(node.parent);
  if (isRootNode) {
    onNext(node);
  }
}

function sortDescendingByPriority(a: ProcessorFn, b: ProcessorFn): number {
  let result = 0;
  const priorityA = a[PrioritySymbol];
  const priorityB = b[PrioritySymbol];

  if (priorityA > priorityB) {
    // because descending, we set -1
    result = -1;
  } else {
    result = 1;
  }

  return result;
}

/**
 * Selects (sub-)properties that should get converted into children nodes of type `ObjectTreeNode`.
 * @param input The read value that gets converted to ObjectTreeNode
 */
function childSelector(input: any): any {
  let value = input;

  while (isBuildable(value)) {
    value = value.value;
  }

  return value;
}
