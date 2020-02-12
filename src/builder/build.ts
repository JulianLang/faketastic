import { ObjectTreeNode, toValue, traverse, treeOf } from 'treelike';
import { asBuildable, stripBuildable } from '../buildable';
import { Types } from '../constants';
import { FaketasticNode } from '../types';
import { isType, toFaketasticNode } from '../util';
import { isValueFn } from '../value-fns';
import { BuilderFn } from './builder.fn';
import { handleAttachedFns } from './handler/attached-fn.handler';
import { AttachedFunctionHandler } from './handler/attached-function.handler';
import { getRawValue } from './traverser';

export const build: BuilderFn<any> = (input: any) => {
  const tree = treeOf(input, getRawValue);

  const builtTree = buildData(tree);
  const output = toValue(builtTree);

  return output;
};

function buildData(tree: ObjectTreeNode): ObjectTreeNode {
  const faketasticTree = toFaketasticNode(tree)!;

  traverse(faketasticTree, node => buildNode(node));
  traverse(faketasticTree, node => resolveIfReference(node));

  return faketasticTree;
}

function buildNode(node: FaketasticNode): void {
  const buildable = asBuildable(node.value);
  node.setValue(buildable);

  const attachedFnHandler = handleAttachedFns(node);
  prebuild(attachedFnHandler);

  if (isValueFn(buildable.value)) {
    buildable.value = buildable.value(buildable);
    node.setValue(buildable);

    if (node.isBuildable()) {
      buildNode(node);
    }
  }

  if (node.isContainer()) {
    node.value = stripBuildable(node.value);
    buildNode(node);
  }

  postbuild(attachedFnHandler);
}

function prebuild(attachedFnHandler: AttachedFunctionHandler): void {
  attachedFnHandler.runReaderFns();
  attachedFnHandler.runArchitectFns();
  attachedFnHandler.runPreprocessorFns();
}

function postbuild(attachedFnHandler: AttachedFunctionHandler): void {
  attachedFnHandler.runPostprocessorFns();
}

function resolveIfReference(node: FaketasticNode): void {
  if (!isType(node.value, Types.ReferenceFn)) {
    return;
  }

  const value = node.value();
  node.setValue(value);
}
