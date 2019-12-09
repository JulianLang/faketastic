import { findNode, treeOf } from 'treelike';
import { RecursionDepth } from '../../../src';

describe('recursion depth controller', () => {
  it('should throw for negative depths', () => {
    // arrange, act, assert
    expect(() => RecursionDepth([], -2, -1)).toThrowMatching((err: Error) =>
      err.message.includes('negative'),
    );
  });

  it('should stop after random generated depth', () => {
    // arrange
    const endValue = null;
    const checkDepth = RecursionDepth(endValue, 3, 3);
    const testTree = treeOf({
      level1: {
        level2: {
          level3: {
            // exceeding recursion depth here:
            level4: {},
          },
        },
      },
    });
    const stopNode = findNode(testTree, n => n.name === 'level4');
    // init fn with root node
    checkDepth(testTree);

    // act
    const result = checkDepth(stopNode!);

    // assert
    expect(result).toEqual({ endWithValue: endValue });
  });

  it('should immediately stop recursion if target depth is "0"', () => {
    // arrange
    const endValue = null;
    const checkDepth = RecursionDepth(endValue, 0, 0);
    const testTree = treeOf({});

    // act
    const result = checkDepth(testTree);

    // assert
    expect(result).toEqual({ endWithValue: endValue });
  });
});
