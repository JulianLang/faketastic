import {
  copyAttributes,
  isDefined,
  leafTraverser,
  nodeTypeOf,
  ObjectTreeNode,
  traverse,
  treeOf,
} from 'treelike';
import { UnsetValue } from '../constants';
import { isPlaceholder } from '../placeholder';
import { AttachedFn, MutatingFn } from '../types';
import { hasSymbol, isUndefined, removeSymbol, setSymbol } from '../util';
import { isValueFunction } from '../value-fns/util/is-value.fn';
import {
  Buildable,
  BuildRootSymbol,
  FnBuildCycleSymbol,
  FnCalledSymbol,
  FnOrderSymbol,
} from './types';
import { BuildCycle } from './types/build.cycle';
import {
  addAttachedFns,
  cyclesOf,
  isBuildable,
  isBuilt,
  topDownSiblingTraverser,
  unwrapIfBuildable,
} from './util';

/**
 * Builds a `Buildable` and returns the generated mock-data.
 * @param buildable The `Buildable` (e.g. return value of `template`) to build mock data from.
 * @param attachedFns AttachedFns like (e.g. `quantity`) to apply while build.
 */
export function build<R = any, T = any>(buildable: Buildable<T>, ...attachedFns: AttachedFn[]): R {
  return buildChild(buildable, undefined, ...attachedFns);
}

export function rebuild(node: ObjectTreeNode, until: BuildCycle): void {
  do {
    const subtree = treeOf(node.value, childSelector);
    subtree.parent = node.parent;
    subtree.name = node.name;
    copyAttributes(subtree, node);
    setSymbol(BuildRootSymbol, node);
    runCyclesTo(until, node);
  } while (!isBuilt(node.value, until));

  removeSymbol(BuildRootSymbol, node);
}

function runCyclesTo(cycle: BuildCycle, node: ObjectTreeNode<any>) {
  const cyclesToRun = cyclesOf(cycle);

  for (const currentCycle of cyclesToRun) {
    // crucial: build node before postprocessing
    if (currentCycle === 'postprocessor') {
      buildNode(node);
    }

    runCycle(currentCycle, node);
  }
}

export function buildChild<R = any, T = any>(
  buildable: Buildable<T>,
  asChildOf?: ObjectTreeNode,
  ...attachedFns: AttachedFn[]
): R {
  addAttachedFns<T>(attachedFns, buildable);

  const buildableNode = treeOf(buildable, childSelector);
  setSymbol(BuildRootSymbol, buildableNode);

  if (isDefined(asChildOf)) {
    buildableNode.parent = asChildOf;
    buildableNode.name = '$child-root';
  }

  runCycle('initializer', buildableNode);
  runCycle('preprocessor', buildableNode);
  run(buildableNode, node => buildNode(node));
  runCycle('postprocessor', buildableNode);
  runCycle('finalizer', buildableNode);

  updateType(buildableNode);
  runReverse(buildableNode, node => writeValues(node), asChildOf);

  // base root:
  if (isUndefined(buildableNode.parent)) {
    run(buildableNode, finalize);
  }

  return buildableNode.value as any;
}

/**
 * Runs the specified build cycle on the given node.
 * @param cycle The cycle to run on the specified node.
 * @param buildableNode The node to run the cycle on.
 */
function runCycle(cycle: BuildCycle, buildableNode: ObjectTreeNode): void {
  run(buildableNode, node => runTreeReaderFns(cycle, node));
  run(buildableNode, node => runMutatingFns(cycle, node));
}

function writeValues(node: ObjectTreeNode): void {
  // buildable has a value property which holds the actual built value.
  // However, this value can again be a buildable, until a leaf of the tree is reached
  const value = unwrapIfBuildable(node.value);

  // leave placeholder untouched, they get built later on.
  if (isPlaceholder(value)) {
    return;
  }

  setValue(value, node);

  // value nodes must not have any children
  if (node.type !== 'value') {
    buildChildrenOf(node);
  }
}

/**
 * Builds a node by replacing its value with an empty object or array (depending on node type)
 * and assigning its children's values to the object / array as either properties or items.
 * @param node The node to build its children.
 */
function buildChildrenOf(node: ObjectTreeNode) {
  for (const child of node.children) {
    // all children must have names
    node.value[child.name!] = child.value;
  }
}

/**
 * Finalizes the value tree by building potentially remaining `Placeholder`s.
 * @param node The root node to begin cleaning process from.
 */
function finalize(node: ObjectTreeNode): void {
  if (node.value === UnsetValue) {
    console.warn(`faketastic: finalize: Unset value found on property "${node.name}".`);
    node.value = undefined;
  } else if (isBuildable(node.value)) {
    const buildable = node.value;
    // Buildables other than placeholders should be built by now.
    console.assert(isPlaceholder(buildable.value));

    if (isPlaceholder(buildable.value)) {
      node.value = buildChild(node.value, node);
    }
  }
}

/**
 * Runs all tree-mutating functions (e.g. `ProcessorFns` and `ArchitectFns`) on a given node
 * for the specified build-cycle.
 * @param cycle The cycle for which to run the AttachedFns.
 * @param node The node on which to run its AttachedFns.
 */
function runMutatingFns(cycle: BuildCycle, node: ObjectTreeNode): void {
  if (isBuildable(node.value)) {
    node.value.architects
      .filter(fn => hasSymbol(FnBuildCycleSymbol, fn, cycle))
      .filter(fn => !hasSymbol(FnCalledSymbol, fn, node))
      .sort(sortByOrderNumber)
      .forEach(architectFn => architectFn(node));

    node.value.processors
      .filter(fn => hasSymbol(FnBuildCycleSymbol, fn, cycle))
      .filter(fn => !hasSymbol(FnCalledSymbol, fn, node))
      .sort(sortByOrderNumber)
      .forEach(processorFn => {
        processorFn(node);
        updateType(node);
      });
  }
}

/**
 * Runs all ReadonlyFns on a given node for a specified build-cycle.
 * @param cycle The cycle for which to run the ReadonlyFns.
 * @param node The node on whcih to run its ReadonlyFns.
 */
function runTreeReaderFns(cycle: BuildCycle, node: ObjectTreeNode): void {
  if (isBuildable(node.value)) {
    node.value.treeReaders
      .filter(fn => hasSymbol(FnBuildCycleSymbol, fn, cycle))
      .filter(fn => !hasSymbol(FnCalledSymbol, fn, node))
      .forEach(treeReader => treeReader(node));
  }
}

/**
 * Updates the node type of a given node by aligning it to its value type.
 * @param node The node to update its type.
 */
function updateType(node: ObjectTreeNode) {
  const value = unwrapIfBuildable(node.value);
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

  if (isValueFunction(buildable.value)) {
    const builderFn = buildable.value;
    buildable.value = builderFn();

    updateType(node);
  }
}

/**
 * Updates the value of a node and aligns the node's `type` to the updated value.
 * @param value The value to set on the given node.
 * @param node The node that should udpate its value.
 */
function setValue(value: any, node: ObjectTreeNode) {
  node.value = value;
  updateType(node);
}

/**
 * Traverses a tree (top-down), starting from a given node.
 * @param node The node to start traversion from.
 * @param onNext The callback function to call for each node reached.
 */
function run<T>(node: ObjectTreeNode<T>, onNext: (node: ObjectTreeNode<T>) => void): void {
  traverse(node, onNext, topDownSiblingTraverser);
}

/**
 * Traverses a tree (bottom-up), starting from a given node.
 * @param node The node to start traversion from.
 * @param onNext The callback function to call for each node reached.
 */
function runReverse<T>(
  node: ObjectTreeNode<T>,
  onNext: (node: ObjectTreeNode<T>) => void,
  asChildOf?: ObjectTreeNode,
): void {
  if (isDefined(asChildOf)) {
    runChildScopedReverse<T>(node, onNext, asChildOf);
  } else {
    traverse(node, onNext, leafTraverser);
  }

  // also include root
  onNext(node);
}

/**
 * Runs an child-excpert of the tree reversively.
 * @param node The node to start traversion from.
 * @param onNext The callback function to be called for each traversed node.
 * @param asChildOf The node that limits the child scope.
 */
function runChildScopedReverse<T>(
  node: ObjectTreeNode<T>,
  onNext: (node: ObjectTreeNode<T>) => void,
  asChildOf: ObjectTreeNode<any>,
) {
  // only build child's tree scope, so stop when reaching asChildOf (child's root node)
  leafTraverser(node, onNext, node => node === asChildOf);
  // ... but still emit rootNode as well
  onNext(asChildOf);
}

/**
 * Compares two processor functions by its processor order.
 * @param a A processor function as comparison subject.
 * @param b A processor function as comparison object.
 */
function sortByOrderNumber(a: MutatingFn, b: MutatingFn): number {
  let result = 0;
  const orderA = a[FnOrderSymbol];
  const orderB = b[FnOrderSymbol];

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
