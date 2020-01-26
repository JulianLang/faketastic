import { createNode } from 'treelike';
import { buildNode } from '../../src/builder/build-node';
import { createValueFn } from '../../src/value-fns';

describe('buildNode', () => {
  it('should run ValueFns on a given node', () => {
    // arrange
    const expectedValue = 'Pete';
    const valueFn = createValueFn(() => expectedValue);
    const node = createNode('name', valueFn);

    // act
    buildNode(node);

    // assert
    expect(node.value).toBe(expectedValue);
  });
});
