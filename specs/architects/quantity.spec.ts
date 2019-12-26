import { createNode, ObjectTreeNode } from 'treelike';
import {
  asBuildable,
  build,
  createBuildable,
  createProcessorFn,
  quantity,
  range,
  template,
  use,
} from '../../src';
import { includeAttachedFnSpecs } from '../spec-helpers/shared-specs';
import { createChildTreeNode } from '../spec-helpers/spec.helper';

describe('quantity', () => {
  it('should call all processor types (sticky and unsticky)', done => {
    // arrange
    let count = 0;
    const procFn1 = () => {
      count++;
    };
    const procFn2 = () => {
      count++;
      expect(count).toEqual(2);
      done();
    };

    const tmpl = template({
      a: range(
        1,
        10,
        quantity(() => 1),
        // this should stick to node "a" and should not be applied to multiplied nodes of "quantity()"
        createProcessorFn(procFn1, 'initializer', 'sticky'),
        createProcessorFn(procFn2, 'initializer', 'unsticky'),
      ),
    });

    // act
    build(tmpl);
  });

  it('should respect stickiness = sticky', () => {
    // arrange
    const stickyProcFn = (node: ObjectTreeNode) => {
      // assert
      expect(node.name).toEqual('a');
      expect(node.parent!.name).toEqual('$root');
    };

    const tmpl = template({
      a: range(
        1,
        10,
        quantity(() => 1),
        // this should stick to node "a" and should not be applied to multiplied nodes of "quantity()"
        createProcessorFn(stickyProcFn, 'initializer', 'sticky'),
      ),
    });

    // act
    build(tmpl);
  });

  it('should respect stickiness = unsticky', () => {
    // arrange
    const unstickyProcFn = (node: ObjectTreeNode) => {
      // assert
      expect(node.name).toEqual(0);
      expect(node.parent!.name).toEqual('a');
    };

    const tmpl = template({
      a: range(
        1,
        10,
        quantity(() => 1),
        // this processor should not stick to node "a" but rather be transferred to multiplied nodes of "quantity()"
        createProcessorFn(unstickyProcFn, 'initializer', 'unsticky'),
      ),
    });

    // act
    build(tmpl);
  });

  it('should connect the content nodes to the rest of tree', () => {
    // arrange, assert
    const assertProcessor = createProcessorFn(
      (node: ObjectTreeNode) => {
        // assertion, only on parent node
        if (node.name === 'a') {
          for (const child of node.children) {
            expect(child.parent).toBe(node);
          }
        }
      },
      'initializer',
      'unsticky',
    );
    const tmpl = template({
      a: use({}, quantity(2), assertProcessor),
    });

    // act
    build(tmpl);
  });

  it('should return an array of the input type, if quantity is a function returning 1', () => {
    // arrange
    const input = createBuildable({});
    const numberOfItems = 1;

    // act
    const result = build(
      input,
      quantity(() => 1),
    );

    // assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(numberOfItems);
  });

  it('should return an array of the input type, if quantity is greater than 1', () => {
    // arrange
    const input = createBuildable({});

    // act
    const result = build(input, quantity(2));

    // assert
    expect(Array.isArray(result)).toEqual(true);
  });

  it('should return an empty array of the input type, if quantity is constant 0', () => {
    // arrange
    const input = createBuildable({});
    const numberOfItems = 0;

    // act
    const result = build(input, quantity(0));

    // assert
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(numberOfItems);
  });

  it('should keep the current parent node, if quantity is set to constant 1', () => {
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
    const quantityArchitect = quantity(numberOfItems);
    const value = { a: 1, b: true, c: 'str' };
    const node = createNode('obj', value);

    // act
    quantityArchitect(node);

    // assert
    const buildable = asBuildable(node.value);

    expect(buildable.value).toEqual([]);
    expect(node.children).toEqual(node.children);
    expect(node.children.length).toEqual(numberOfItems);
    expect(node.type).toEqual('array');
    expect(node.children[0].value).toEqual(value);
    expect(node.children[1].value).toEqual(value);
  });

  it('should add no additional array-parent node, if quantity parameter "inline" is set to true', () => {
    // arrange
    const numberOfItems = 2;
    const quantityArchitect = quantity(numberOfItems, 'useParentArray');
    const obj1 = { a: 1 };

    /*
      Test-Tree looks like that:

         ($root)
            |
          (arr)
            |
          (node)
    */
    const node = createNode('a', obj1);
    const arrayNode = createNode('arr', [], [node]);
    const root = createNode('$root', null, [arrayNode]);
    node.parent = arrayNode;
    arrayNode.parent = root;

    // act
    quantityArchitect(node);

    // assert
    const buildable = asBuildable(node.value);

    // child no. 1 must equal original node, except parent and name
    const clonedNode1 = root!.children[0].children[0];
    expect(clonedNode1.name).toEqual(0);
    expect(clonedNode1.value).toEqual(buildable.value);
    expect(clonedNode1.children).toEqual(node.children);
    expect(clonedNode1.type).toEqual(node.type);

    // child no. 2 must equal original node, except parent and name
    const clonedNode2 = root!.children[0].children[1];
    expect(clonedNode2.name).toEqual(1);
    expect(clonedNode2.value).toEqual(buildable.value);
    expect(clonedNode2.children).toEqual(node.children);
    expect(clonedNode2.type).toEqual(node.type);
  });

  includeAttachedFnSpecs('architect', quantity, 2);
});
