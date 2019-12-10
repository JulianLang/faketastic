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
    const matchNode = findNode(tree, n => n.name === '2')!;
    matchNode.value[TestSymbol] = false;

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
    const node = findNode(tree, n => n.name === '3')!;
    node.value[TestSymbol] = false;

    // act
    const anchestor = findAnchestor(TestSymbol, node);

    // assert
    expect(anchestor).toBe(undefined);
  });
});
