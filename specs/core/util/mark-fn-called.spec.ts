import { createNode } from 'treelike';
import { FnCalledSymbol, markFnCalled } from '../../../src/core';
import { getSymbol } from '../../../src/util';

describe('markFnCalled', () => {
  it('should set the FnCalledSymbol to the given node', () => {
    // arrange
    const node = createNode('name', {});
    const fn = () => {};

    // act
    markFnCalled(fn, node);

    // assert
    expect(getSymbol(FnCalledSymbol, fn)).toBe(node);
  });
});
