import { createNode, treeOf } from 'treelike';
import { createBuildable } from '../../src/buildable';
import { Types } from '../../src/constants';
import { clone, setType, toFaketasticNode } from '../../src/util';

describe('toFaketasticNode', () => {
  it('should be independent after cloning', () => {
    // arrange
    const node = createNode('a', null);
    const faketasticNode = toFaketasticNode(node)!;
    const cloneNode = clone(faketasticNode);

    // act
    faketasticNode.setValue(42);

    // assert
    expect(faketasticNode.value).toBe(42);
    expect(cloneNode.value).toBe(null);
  });

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

  it('should have a working setValue function', () => {
    // arrange
    const name = 'name';
    const node = createNode(name, null);
    const faketasticNode = toFaketasticNode(node)!;
    const newValue = { a: 42 };

    // pre-condition
    expect(faketasticNode.children.length).toBe(0);
    expect(faketasticNode.parent).toBeUndefined();
    expect(faketasticNode.recursesTo).toBeUndefined();
    expect(faketasticNode.name).toBe(name);
    expect(faketasticNode.value).toBe(null);
    expect(faketasticNode.type).toBe('value');

    // act
    faketasticNode.setValue(newValue);

    // assert: unchanged
    expect(faketasticNode.parent).toBeUndefined();
    expect(faketasticNode.name).toBe(name);
    expect(faketasticNode.recursesTo).toBeUndefined();
    // assert: changed
    expect(faketasticNode.value).toEqual(newValue);
    expect(faketasticNode.type).toBe('object');
    // assert: children
    expect(faketasticNode.children.length).toBe(1);
    const child = faketasticNode.children[0];
    expect(child.type).toBe('value');
    expect(child.name).toBe('a');
    expect(child.value).toBe(42);
  });

  it('should have a working isRefDependent function', () => {
    // arrange
    const ref = setType(Types.ReferenceFn, () => null);
    const node = createNode('dependent', ref);
    const faketasticNode = toFaketasticNode(node);

    // act, assert
    expect(faketasticNode?.isRefDependent()).toBe(true);
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

  it('should correctly link children to parent', () => {
    // arrange
    const parent = { childA: {}, childB: {} };
    const tree = treeOf(parent);

    // act
    const faketasticTree = toFaketasticNode(tree)!;

    // assert
    expect(faketasticTree.children.length).toBeGreaterThan(0);
    expect(faketasticTree.children.length).toBe(Object.keys(parent).length);
    faketasticTree.children.forEach(child => {
      expect(child.parent).toBe(faketasticTree);
    });
  });
});

describe('toFaketasticNode.isRefDependent', () => {
  it('should detect a ReferenceFn nested within a buildable', () => {
    // arrange
    const ref = setType(Types.ReferenceFn, () => null);
    const buildable = createBuildable(ref);
    const node = createNode('dependent', buildable);
    const faketasticNode = toFaketasticNode(node);

    // act, assert
    expect(faketasticNode?.isRefDependent()).toBe(true);
  });

  it('should return true for a node that is marked as ref-dependent', () => {
    // arrange
    const node = createNode('dependent', null);
    const faketasticNode = toFaketasticNode(node);
    setType(Types.ReferenceDependent, faketasticNode);

    // act, assert
    expect(faketasticNode?.isRefDependent()).toBe(true);
  });
});
