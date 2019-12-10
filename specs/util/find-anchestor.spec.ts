import { findNode, treeOf } from 'treelike';
import { findAnchestor } from '../../src/util';

describe('findAnchestor helper function', () => {
  const TestSymbol = Symbol('faketastic.test');

  it('should return undefined if there is no matching node', () => {
    // arrange
    const tree = treeOf({
      1: {
        2: {
          3: {},
        },
      },
    });
    const node = findNode(tree, n => n.name === '3')!;

    // act
    const anchestor = findAnchestor(TestSymbol, node);

    // assert
    expect(anchestor).toBe(undefined);
  });

  it('should return the matching node', () => {
    // arrange
    const tree = treeOf({
      1: {
        2: {
          3: {},
        },
      },
    });
    const node = findNode(tree, n => n.name === '3')!;
    const matchNode: any = findNode(tree, n => n.name === '2')!;
    matchNode[TestSymbol] = false;

    // act
    const anchestor = findAnchestor(TestSymbol, node);

    // assert
    expect(anchestor).toBe(matchNode);
  });

  it('should not find the start node itself', () => {
    // arrange
    const tree = treeOf({
      1: {
        2: {
          3: {},
        },
      },
    });
    const node: any = findNode(tree, n => n.name === '3')!;
    node[TestSymbol] = false;

    // act
    const anchestor = findAnchestor(TestSymbol, node);

    // assert
    expect(anchestor).toBe(undefined);
  });

  it('should not find a node if the given withValue parameter does not match', () => {
    // arrange
    const tree = treeOf({
      1: {
        2: {
          3: {},
        },
      },
    });

    const withValue = 42;
    const node = findNode(tree, n => n.name === '3')!;
    const matchNode: any = findNode(tree, n => n.name === '2')!;
    matchNode[TestSymbol] = false;

    // act
    const anchestor = findAnchestor(TestSymbol, node, withValue);

    // assert
    expect(anchestor).toBe(undefined);
  });

  it('should find a node if the given withValue parameter does match', () => {
    // arrange
    const tree = treeOf({
      1: {
        2: {
          3: {},
        },
      },
    });

    const withValue = 42;
    const node = findNode(tree, n => n.name === '3')!;
    const matchNode: any = findNode(tree, n => n.name === '2')!;
    matchNode[TestSymbol] = withValue;

    // act
    const anchestor = findAnchestor(TestSymbol, node, withValue);

    // assert
    expect(anchestor).toBe(matchNode);
  });
});
