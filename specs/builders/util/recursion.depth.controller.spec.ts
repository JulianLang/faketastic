import { findNode, treeOf } from 'treelike';
import { RecursionDepth, RecursionRootSymbol } from '../../../src';
import { setSymbol } from '../../../src/util';

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
    /*
      itself() marks the recursion root template with the RecursionRootSymbol
      and the property name for distinction. To mock that out, we pass level4
      as property name, as if this would be the name of the original template.
    */
    setSymbol(RecursionRootSymbol, testTree, 'level4');

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
