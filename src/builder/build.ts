import { ObjectTreeNode, toValue, traverse, treeOf } from 'treelike';
import {
  asBuildable,
  Buildable,
  copyPostprocessors,
  isBuildable,
  stripBuildable,
} from '../buildable';
import { Types } from '../constants';
import { FaketasticNode, Func } from '../types';
import { isType, setType, toFaketasticNode } from '../util';
import { isValueFn } from '../value-fns';
import { BuilderFn } from './builder.fn';
import { handleAttachedFns } from './handler/attached-fn.handler';
import { AttachedFunctionHandler } from './handler/attached-function.handler';
import { getRawValue } from './traverser';

/** Do NOT use any of these functions in production code. This export is made for test purposes only. */
export const _forTestsOnly = {
  buildData,
  buildNode: buildValueNode,
  resolveIfReference,
  resolveReference,
  createAttachedFnHandler,
  prebuild,
  postbuild,
  markBranchRefDependent,
};

export const build: BuilderFn<any> = (input: any) => {
  const tree = treeOf(input, getRawValue);

  const builtTree = buildData(tree);
  const output = toValue(builtTree);

  return output;
};

function buildData(tree: ObjectTreeNode): ObjectTreeNode {
  const faketasticTree = toFaketasticNode(tree);
  const cachedHandlers = new Map<FaketasticNode, AttachedFunctionHandler>();

  traverse(faketasticTree, node => {
    const handler = createAttachedFnHandler(node);
    cachedHandlers.set(node, handler);
  });

  traverse(faketasticTree, node => {
    if (node.currentType() === 'value') {
      const handler = cachedHandlers.get(node)!;
      buildValueNode(node, handler);
    }
  });

  traverse(faketasticTree, node => {
    const handler = cachedHandlers.get(node)!;
    resolveIfReference(node, handler);
  });

  return faketasticTree;
}

function buildValueNode(node: FaketasticNode<Buildable>, handler: AttachedFunctionHandler): void {
  const buildable = node.value;

  prebuild(handler);

  if (isValueFn(buildable.value)) {
    buildable.value = buildable.value(buildable);
    node.setValue(buildable);

    if (node.isBuildable()) {
      buildValueNode(node, handler);
    }
  }

  if (node.isContainer()) {
    copyPostprocessors(
      /* container buildable */ node.value,
      /* inner buildable */ node.value.value,
    );
    node.value = stripBuildable(node.value);
    buildValueNode(node, handler);
  }

  if (node.isRefDependent()) {
    markBranchRefDependent(node);
  } else {
    postbuild(handler);
  }
}

function prebuild(attachedFnHandler: AttachedFunctionHandler): void {
  attachedFnHandler.runReaderFns();
  attachedFnHandler.runArchitectFns();
  attachedFnHandler.runPreprocessorFns();
}

function postbuild(attachedFnHandler: AttachedFunctionHandler): void {
  attachedFnHandler.runPostprocessorFns();
}

function resolveIfReference(node: FaketasticNode, handler: AttachedFunctionHandler): void {
  if (!node.isRefDependent()) {
    return;
  }

  resolveReference(node);
  postbuild(handler);
}

function resolveReference(node: FaketasticNode<any>) {
  const nodeOrBuildable = isBuildable(node.value) ? node.value : node;

  if (isType<Func<[], any>>(Types.ReferenceFn, nodeOrBuildable.value)) {
    nodeOrBuildable.value = nodeOrBuildable.value();
  }

  node.setValue(node.value);
}

function createAttachedFnHandler(node: FaketasticNode<any>): AttachedFunctionHandler {
  const buildable = asBuildable(node.value);
  node.setValue(buildable);
  const handler = handleAttachedFns(node);

  return handler;
}

function markBranchRefDependent(node: FaketasticNode): void {
  let currentNode: FaketasticNode | undefined = node;

  while (currentNode) {
    setType(Types.ReferenceDependent, currentNode);
    currentNode = currentNode.parent;
  }
}
