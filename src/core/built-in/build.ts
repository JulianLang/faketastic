import {
  isDefined,
  leafTraverser,
  nodeTypeOf,
  ObjectTreeNode,
  traverse,
  TraverseCallbackFn,
  treeOf,
} from 'treelike';
import { ArchitectFn } from '../../architects';
import { isBuilderFunction } from '../../builders';
import { isPlaceholder } from '../../placeholder';
import { ProcessorFn, ProcessorFnSymbol } from '../../processors';
import { TreeReaderFn, TreeReaderFnSymbol } from '../../tree-reader';
import { AttachedFn, MutatingFn } from '../../types';
import { extractFns, hasSymbol, isUndefined, isUnset, setSymbol } from '../../util';
import { ArchitectFnSymbol, Buildable, BuildRootSymbol, FnOrderSymbol } from '../types';
import { BuildCycle } from '../types/build.cycle';
import { asBuildable, isBuildable, unwrapIfBuildable } from '../util';

/**
 * Builds a buildable and outputs the generated mock data. The amount of objects
 * being built can be configured via the second parameter.
 * @param buildable An object of interface Buildable that should get built.
 * @param quantity The amount of mock data objects that should be generated from the buildable.
 */
export function build<R = any, T = any>(buildable: Buildable<T>, ...attachedFns: AttachedFn[]): R {
  return buildChild(buildable, undefined, ...attachedFns);
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
  run(buildableNode, node => runReadonlyFns(cycle, node));
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
  if (isUnset(node.value)) {
    console.warn(`faketastic/clean-up: Unset value found on property "${node.name}".`);
    node.value = undefined;
  } else if (isBuildable(node.value)) {
    // Buildables other than placeholders should be built by now.
    console.assert(isPlaceholder(node.value.value));

    if (isPlaceholder(node.value.value)) {
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
    runArchitectFns(cycle, node);
    runProcessors(cycle, node);
  }
}

/**
 * Runs all ReadonlyFns on a given node for a specified build-cycle.
 * @param cycle The cycle for which to run the ReadonlyFns.
 * @param node The node on whcih to run its ReadonlyFns.
 */
function runReadonlyFns(cycle: BuildCycle, node: ObjectTreeNode): void {
  if (isBuildable(node.value)) {
    node.value.treeReaders
      .filter(fn => hasSymbol(TreeReaderFnSymbol, fn, cycle))
      .forEach(readonlyFn => readonlyFn(node));
  }
}

/**
 * Runs all ArchitectFns on a given node for a specified build-cycle.
 * @param cycle The cycle for which to run the ArchitectFns.
 * @param node The node on whcih to run its ArchitectFns.
 */
function runArchitectFns(cycle: BuildCycle, node: ObjectTreeNode<Buildable>): void {
  node.value.architects
    .filter(fn => hasSymbol(ArchitectFnSymbol, fn, cycle))
    .sort(sortByOrderNumber)
    .forEach(architectFn => architectFn(node));
}

/**
 * Runs all ProcessorFns on a given node for a specified build-cycle.
 * @param cycle The cycle for which to run the ProcessorFns.
 * @param node The node on whcih to run its ProcessorFns.
 */
function runProcessors(cycle: BuildCycle, node: ObjectTreeNode<Buildable>): void {
  node.value.processors
    .filter(fn => hasSymbol(ProcessorFnSymbol, fn, cycle))
    .sort(sortByOrderNumber)
    .forEach(processorFn => {
      processorFn(node);
      updateType(node);
    });
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

  if (isBuilderFunction(buildable.value)) {
    const builderFn = buildable.value;
    buildable.value = builderFn();

    updateType(node);

    if (node.type !== 'value') {
      const buildableValue = asBuildable(buildable.value);
      const built = buildChild(buildableValue, node);

      setValue(built, node);
    }
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
 * Adds the specified AttachedFns to a given buildable.
 * @param attachedFns The AttachedFns to add to the buildable.
 * @param buildable The buildable receiving the AttachedFns.
 */
function addAttachedFns<T = any>(attachedFns: AttachedFn[], buildable: Buildable<T>) {
  const processors = extractFns(ProcessorFnSymbol, attachedFns) as ProcessorFn[];
  const architects = extractFns(ArchitectFnSymbol, attachedFns) as ArchitectFn[];
  const treeReaders = extractFns(TreeReaderFnSymbol, attachedFns) as TreeReaderFn[];
  buildable.processors.push(...processors);
  buildable.architects.push(...architects);
  buildable.treeReaders.push(...treeReaders);
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
    // only build child's tree scope, so stop when reaching asChildOf (child's root node)
    leafTraverser(node, onNext, node => node === asChildOf);
    // ... but still emit rootNode as well
    onNext(asChildOf);
  } else {
    traverse(node, onNext, leafTraverser);
  }

  // also include root
  onNext(node);
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

// TODO: langju: this is not traversing as intended yet.
/**
 * Traverses a tree from top to down by traversing the siblings.
 * @param node The node to start traversion from. Usually the tree's root.
 * @param onNext The callback function to call for each and every traversed node.
 */
function topDownSiblingTraverser(node: ObjectTreeNode, onNext: TraverseCallbackFn): void {
  // also include root
  if (hasSymbol(BuildRootSymbol, node)) {
    onNext(node);
  }

  for (const child of node.children) {
    onNext(child);
  }

  for (const child of node.children) {
    topDownSiblingTraverser(child, onNext);
  }
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
