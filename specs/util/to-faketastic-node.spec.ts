import { createNode, treeOf } from 'treelike';
import { createBuildable } from '../../src/buildable';
import { toFaketasticNode } from '../../src/util';

describe('toFaketasticNode', () => {
  it('should return undefined when "undefined" was passed as input', () => {
    // arrange, act
    const result = toFaketasticNode(undefined);

    // assert
    expect(result).toBe(undefined);
  });

  it('should convert an ObjectTreeNode into a FaketasticTreeNode', () => {
    // arrange
    const node = createNode('name', 0);

    // act
    const faketasticNode = toFaketasticNode(node)!;

    // assert
    expect(faketasticNode.children.length).toBe(node.children.length);
    expect(faketasticNode.parent).toBeUndefined();
    expect(faketasticNode.isContainer).toBeDefined();
    expect(faketasticNode.currentValue).toBeDefined();
  });

  it('should have a working isContainer function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node)!;

    // pre-condition
    expect(faketasticNode.isContainer()).toBe(false);

    // act
    const nestedBuildable = createBuildable(null);
    faketasticNode.value = createBuildable(nestedBuildable);

    // assert
    expect(faketasticNode.isContainer()).toBe(true);
  });

  it('should have a working isBuildable function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node)!;

    // pre-condition
    expect(faketasticNode.isBuildable()).toBe(false);

    // act
    faketasticNode.value = createBuildable(null);

    // assert
    expect(faketasticNode.isBuildable()).toBe(true);
  });

  it('should have a working currentValue function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node)!;

    // pre-condition
    expect(faketasticNode.currentValue()).toBe(0);

    // act
    faketasticNode.value = 42;

    // assert
    expect(faketasticNode.currentValue()).toBe(42);
  });

  it('should have a working currentType function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node)!;

    // pre-condition
    expect(faketasticNode.currentType()).toBe('value');

    // act
    faketasticNode.value = [];

    // assert
    expect(faketasticNode.currentType()).toBe('array');
  });

  it('should also convert child nodes', () => {
    // arrange
    const tree = treeOf({
      a: {
        b: 42,
      },
    });

    // act
    const result = toFaketasticNode(tree)!;

    // assert
    expect(result.children[0]).toBeDefined();
    expect(result.children[0].children[0]).toBeDefined();
    expect(result.children[0].children[0].currentValue()).toBe(42);
  });

  it('should not touch any parents of the passed-in node', () => {
    // arrange
    const parent = createNode('parent', {});
    const child = createNode('child', 0, [], parent);

    // act
    const result = toFaketasticNode(child)!;

    // assert
    expect(result.parent!.currentValue).not.toBeDefined();
    expect(result.parent!.currentType).not.toBeDefined();
    expect(result.parent!.isContainer).not.toBeDefined();
  });
});
