import { createNode, ObjectTreeNode } from 'treelike';
import { quantity } from '../../src/processors/quantity';
import { includeProcessorFnSpecs } from '../spec-helpers/shared-specs';
import { createChildTreeNode } from '../spec-helpers/spec.helper';

describe('quantity processor fn', () => {
  it('should keep the current parent node, if quantity is set to constant-1', () => {
    // arrange
    const processorFn = quantity(1);
    const node = createChildTreeNode();
    const currentParent = node.parent;
    const currentNode = node;
    const negativeTest = { ...node.parent } as ObjectTreeNode<any>;

    // act
    processorFn(node);

    // assert
    expect(node.parent).toBe(currentParent);
    expect(node.parent).not.toBe(negativeTest);

    expect(currentNode.value).toBe(node.value);
    expect(currentNode.name).toBe(node.name);
    expect(currentNode.type).toBe(node.type);
    expect(currentNode.children).toBe(node.children);
  });

  it('should add an additional array-parent node, if quantity is greater than 1', () => {
    // arrange
    const numberOfItems = 2;
    const processorFn = quantity(numberOfItems);
    const value = { a: 1, b: true, c: 'str' };
    const node = createNode('obj', value);

    // act
    processorFn(node);

    // assert

    expect(node.value as any).toEqual([]);
    expect(node.children).toEqual(node.children);
    expect(node.children.length).toEqual(numberOfItems);
    expect(node.type).toEqual('array');

    expect(node.children[0].value).toEqual(value);
    expect(node.children[1].value).toEqual(value);
  });

  it('should add no additional array-parent node, if quantity parameter "inline" is set to true', () => {
    // arrange
    const numberOfItems = 2;
    const processorFn = quantity(numberOfItems, 'useParentArray');
    const obj1 = { a: 1 };
    const node = createNode('a', obj1);
    const arrayNode = createNode('arr', [], [node]);
    const root = createNode('$root', null, [arrayNode]);

    node.parent = arrayNode;
    arrayNode.parent = root;

    // act
    processorFn(node);

    // assert
    // child no. 1 must equal original node, except parent and name
    const cloneOfOriginalNode1 = root!.children[0].children[0];
    expect(cloneOfOriginalNode1.name).toEqual(0);
    expect(cloneOfOriginalNode1.value).toEqual(node.value);
    expect(cloneOfOriginalNode1.children).toEqual(node.children);
    expect(cloneOfOriginalNode1.type).toEqual(node.type);

    // child no. 2 must equal original node, except parent and name
    const cloneOfOriginalNode2 = root!.children[0].children[1];
    expect(cloneOfOriginalNode2.name).toEqual(1);
    expect(cloneOfOriginalNode2.value).toEqual(node.value);
    expect(cloneOfOriginalNode2.children).toEqual(node.children);
    expect(cloneOfOriginalNode2.type).toEqual(node.type);
  });

  includeProcessorFnSpecs(quantity, 1);
});
