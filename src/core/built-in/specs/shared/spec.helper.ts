import { ObjectTreeNode } from 'treelike';
import { Buildable, BuildableSymbol, ProcessorFn } from '../../../types';

const dummyNode: ObjectTreeNode<any> = {
  children: [],
  name: 'child',
  type: 'value',
  value: 'some string',
};

const parentNode: ObjectTreeNode<any> = {
  children: [dummyNode],
  name: 'parent',
  type: 'object',
  value: {
    child: 'some string',
  },
};

export function createChildTreeNode(): ObjectTreeNode<any> {
  const node = { ...dummyNode };
  node.parent = { ...parentNode };
  node.parent.children = [node];

  return node;
}

export function createParentTreeNode(): ObjectTreeNode<any> {
  const node = { ...parentNode };
  node.children = [{ ...dummyNode }];
  node.children[0].parent = node;

  return node;
}

export function createBuildable<T>(tmpl: T, processors: ProcessorFn[] = []): Buildable<T> {
  const buildable: Buildable<any> = {
    [BuildableSymbol]: 'template',
    processors,
    value: tmpl,
  };

  return buildable;
}
