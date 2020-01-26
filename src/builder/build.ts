import { nodeTypeOf, ObjectTreeNode, traverse, treeOf } from 'treelike';
import { AttachedFn, isArchitectFn, isProcessorFn, isReaderFn, ProcessorFn } from '../attached-fns';
import { asBuildable, Buildable, isBuildable } from '../buildable';
import { containsBuildable } from '../buildable/contains-buildable';
import { isValueFn } from '../value-fns';
import { BuilderFn } from './builder.fn';
import { getRawValue } from './traverser';

export const build: BuilderFn<any> = (input: any, attachedFns: AttachedFn[] = []) => {
  const tree = treeOf(input, getRawValue);

  traverse(tree, node => buildNode(node));
  traverse(tree, node => finalize(node));

  return tree.value;
};

function buildNode(node: ObjectTreeNode) {
  if (isBuildable(node.value)) {
    prebuild(node);
  }

  // normalizing the value to buildable helps unifying the next build step
  const buildable = asBuildable(node.value);

  if (isValueFn(buildable.value)) {
    buildable.value = buildable.value();
    setValue(buildable, node);
  }

  // postprocessors get lost after building the node via build(), so cache it for calling it afterwards.
  const cachedPostprocessors = extractPostprocessors(buildable);

  if (containsBuildable(node.value)) {
    const valueToBuild = getRawValue(node.value);
    const built = build(valueToBuild);
    setValue(built, node);
  }

  node.value = postbuild(cachedPostprocessors, node.value);
}

function prebuild(node: ObjectTreeNode<Buildable>): void {
  const buildable = node.value;

  buildable.attachedFns.filter(fn => isReaderFn(fn)).forEach(readerFn => readerFn(node));
  buildable.attachedFns
    .filter(fn => isArchitectFn(fn))
    .forEach(architectFn => {
      buildable.value = architectFn(buildable.value);
    });

  buildable.attachedFns
    .filter(fn => isProcessorFn(fn, 'prebuild'))
    .forEach(prebuildProcessor => {
      buildable.value = prebuildProcessor(buildable.value);
    });
}

function extractPostprocessors(buildable: Buildable): ProcessorFn[] {
  return buildable.attachedFns.filter(fn => isProcessorFn(fn, 'postbuild')) as ProcessorFn[];
}

function postbuild(postprocessors: ProcessorFn[], value: any): any {
  let currentValue = value;

  postprocessors.forEach(prebuildProcessor => {
    currentValue = prebuildProcessor(currentValue);
  });

  return currentValue;
}

function finalize(node: ObjectTreeNode): void {
  const value = getRawValue(node.value);
  setValue(value, node);

  // value nodes must not have any children
  if (node.type !== 'value') {
    buildChildren(node);
  }
}

function buildChildren(node: ObjectTreeNode) {
  for (const child of node.children) {
    // all children must have names
    node.value[child.name!] = child.value;
  }
}

function setValue(value: any, node: ObjectTreeNode) {
  node.value = value;
  node.type = nodeTypeOf(node.value);
}
