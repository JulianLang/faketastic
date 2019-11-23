import { ObjectTreeNode } from 'treelike';

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
