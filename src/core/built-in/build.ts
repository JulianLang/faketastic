import { nodeTypeOf, ObjectTreeNode, treeOf } from 'treelike';
import { Buildable, PrioritySymbol, ProcessorFn } from '../types';
import { ProcessorType } from '../types/processor.types';
import { Quantity } from '../types/quantity';
import { clone, isBuildable, isBuilderFunction, isDefined, isProcessorFn } from '../util';
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

/**
 * Builds a `Buildable`'s template instantly and decoupled from the main build-cycles. Per default the given `Buildable` gets
 * cloned before building it. To support references inside the dynamic template to target non-local values, the `hostNode`
 * parameter gets attached as a parent to the dynamic template root-node acting as a bridge to the main object-tree.
 * @param buildable The buildable to be built.
 * @param hostNode The `ObjectTreeNode` to be attached as parent node. This gives the template access to the main object-tree
 * which in turn allows references of the dynamic template to target and resolve non-local values.
 * @param cloneBeforeBuild Defines whether to clone the buildable before building it. Default is `true`.
 */
export function buildDynamicTemplate(
  buildable: Buildable<any>,
  hostNode: ObjectTreeNode<any>,
  cloneBeforeBuild = true,
): any {
  const dynamicTemplate = cloneBeforeBuild ? clone(buildable.value) : buildable.value;
  const builtTemplate = buildInstance(dynamicTemplate, hostNode);

  return builtTemplate;
}

function buildInstance<T>(buildable: Buildable<T>, asChildOf?: ObjectTreeNode) {
  const root = treeOf(buildable, childSelector);

  if (isDefined(asChildOf)) {
    /*
     * Note: unidirectional relationship: root --> parent.
     *
     * This is intentionally because we want only the dynamic template to be able to see the object-tree,
     * but not vice versa, because the dynamic template gets build in for its own, decoupled of the rest
     * of the tree. Still it may need access to the rest of the tree to resolve references for example.
     * This is why we attach the tree to the template as parent here:
     */
    root.parent = asChildOf;
    root.name = dynamicRootIdentifier;
  }

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

  /*
   * Builder Functions like "oneOf", can not only return static values like strings or numbers,
   * but also again Buildables defining templates, that need to get built as well.
   * This behavior enables the user to randomly select templates.
   * That's why we call the `buildDynamicTemplate`-method here.
   */
  if (isBuildable(buildable.value)) {
    const builtTemplate = buildDynamicTemplate(buildable, node);
    setValue(builtTemplate, node);
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
