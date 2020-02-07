import { ObjectTreeNode, toValue, traverse, treeOf } from 'treelike';
import { isArchitectFn, isProcessorFn, isReaderFn } from '../attached-fns';
import { asBuildable, Buildable, stripBuildable } from '../buildable';
import { FaketasticNode } from '../types';
import { toFaketasticNode } from '../util';
import { isValueFn } from '../value-fns';
import { BuilderFn } from './builder.fn';
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

  return faketasticTree;
}

function buildNode(node: FaketasticNode): void {
  if (node.isBuildable()) {
    prebuild(node);
  }

  const buildable = asBuildable(node.value);

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

  const value = postbuild(buildable);
  node.setValue(value);
}

function prebuild(node: FaketasticNode<Buildable>): void {
  const buildable = node.value;

  buildable.attachedFns.filter(fn => isReaderFn(fn)).forEach(readerFn => readerFn(node));
  buildable.attachedFns
    .filter(fn => isArchitectFn(fn))
    .forEach(architectFn => {
      buildable.value = architectFn(buildable.value);
      node.setValue(buildable);
    });

  buildable.attachedFns
    .filter(fn => isProcessorFn(fn, 'prebuild'))
    .forEach(prebuildProcessor => {
      buildable.value = prebuildProcessor(buildable.value);
      node.setValue(buildable);
    });
}

function postbuild(buildable: Buildable): any {
  const rawValue = getRawValue(buildable.value);
  let currentValue = rawValue;

  buildable.attachedFns
    .filter(fn => isProcessorFn(fn, 'postbuild'))
    .forEach(prebuildProcessor => {
      currentValue = prebuildProcessor(currentValue);
    });

  return currentValue;
}
