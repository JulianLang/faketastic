import { createNode, treeOf } from 'treelike';
import { createBuildable } from '../../src/buildable';
import { Types } from '../../src/constants';
import { clone, setType, toFaketasticNode } from '../../src/util';

describe('toFaketasticNode', () => {
  it('should be independent after cloning', () => {
    // arrange
    const node = createNode('a', null);
    const faketasticNode = toFaketasticNode(node);
    const cloneNode = clone(faketasticNode);

    // act
    faketasticNode.setValue(42);

    // assert
    expect(faketasticNode.value).toBe(42);
    expect(cloneNode.value).toBe(null);
  });

  it('should return throw when "undefined" was passed as input', () => {
    // arrange, act, assert
    expect(() => toFaketasticNode(undefined as any)).toThrowMatching((err: Error) =>
      err.message.includes('convert "undefined"'),
    );
  });

  it('should convert an ObjectTreeNode into a FaketasticTreeNode', () => {
    // arrange
    const node = createNode('name', 0);

    // act
    const faketasticNode = toFaketasticNode(node);

    // assert
    expect(faketasticNode.children.length).toBe(node.children.length);
    expect(faketasticNode.parent).toBeUndefined();
    expect(faketasticNode.isContainer).toBeDefined();
    expect(faketasticNode.getValue).toBeDefined();
  });

  it('should have a working isContainer function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node);

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
    const faketasticNode = toFaketasticNode(node);

    // pre-condition
    expect(faketasticNode.isBuildable()).toBe(false);

    // act
    faketasticNode.value = createBuildable(null);

    // assert
    expect(faketasticNode.isBuildable()).toBe(true);
  });

  it('should have a working currentType function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node);

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
    const faketasticNode = toFaketasticNode(node);
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
    const result = toFaketasticNode(tree);

    // assert
    expect(result.children[0]).toBeDefined();
    expect(result.children[0].children[0]).toBeDefined();
    expect(result.children[0].children[0].getValue()).toBe(42);
  });

  it('should not touch any parents of the passed-in node', () => {
    // arrange
    const parent = createNode('parent', {});
    const child = createNode('child', 0, [], parent);

    // act
    const result = toFaketasticNode(child);

    // assert
    expect(result.parent!.getValue).not.toBeDefined();
    expect(result.parent!.currentType).not.toBeDefined();
    expect(result.parent!.isContainer).not.toBeDefined();
  });

  it('should correctly link children to parent', () => {
    // arrange
    const parent = { childA: {}, childB: {} };
    const tree = treeOf(parent);

    // act
    const faketasticTree = toFaketasticNode(tree);

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

describe('faketasticNode: getValue', () => {
  it('[valueNode] should have a working getValue function', () => {
    // arrange
    const node = createNode('name', 0);
    const faketasticNode = toFaketasticNode(node);

    // pre-condition
    expect(faketasticNode.getValue()).toBe(0);

    // act
    faketasticNode.value = 42;

    // assert
    expect(faketasticNode.getValue()).toBe(42);
  });

  [
    ['arrayNode', [], [42, null]],
    ['objectNode', {}, { child1: 42, child2: null }],
  ].forEach(params => {
    it(`[${params[0]}] should have a working getValue function`, () => {
      // arrange
      const initialValue = params[1];
      const child1 = createNode('child1', 42);
      const child2 = createNode('child2', null);
      const node = createNode('node', initialValue, [child1, child2]);
      const faketasticNode = toFaketasticNode(node);

      // act, assert
      const expected = params[2];
      expect(faketasticNode.getValue()).toEqual(expected);
    });
  });

  [
    ['arrayNode', [], [[42]]],
    ['objectNode', {}, { child2: { child1: 42 } }],
  ].forEach(params => {
    it(`[${params[0]}] should also resolve nested children`, () => {
      // arrange
      const initialValue = params[1];
      const child1 = createNode('child1', 42);
      const child2 = createNode('child2', initialValue, [child1]);
      const node = createNode('node', initialValue, [child2]);
      const faketasticNode = toFaketasticNode(node);

      // act, assert
      const expected = params[2];
      expect(faketasticNode.getValue()).toEqual(expected);
    });
  });

  it('should resolve mixed node types', () => {
    // arrange
    const original = {
      a: [
        42,
        {
          b: 4711,
        },
      ],
      c: {
        d: [42, { e: null }],
      },
    };
    const tree = treeOf(original);
    const faketasticTree = toFaketasticNode(tree);

    // act
    const result = faketasticTree.getValue();

    // assert
    expect(result).toEqual(original);
  });
});
