import { createNode, defaultRootName, treeOf } from 'treelike';
import { BuildRootSymbol, setSymbol, topDownSiblingTraverser } from '../../../src';

describe('topDownTraverser', () => {
  /*
      Intended Traversal:

               (1)
             /  |  \
           (2) (3) (4)
          /    / \
        (5)  (6) (7)
  */

  it('should travel down the tree level by level', () => {
    // arrange
    const order: string[] = [];
    const obj = {
      2: {
        5: null,
      },
      3: {
        6: null,
        7: null,
      },
      4: {},
    };
    const tree = treeOf(obj);

    // act
    topDownSiblingTraverser(tree, n => order.push(n.name as string));

    // assert
    expect(order).toEqual([defaultRootName, '2', '3', '4', '5', '6', '7']);
  });

  it('should consider BuildRootSymbol and emit the node, even if it has a parent node.', () => {
    // arrange
    const order: string[] = [];
    const nodeName = 'node';
    const parentNode = createNode('parent', {});
    const node = createNode(nodeName, {}, [], parentNode);
    setSymbol(BuildRootSymbol, node);

    // act
    topDownSiblingTraverser(node, n => order.push(n.name as string));

    // assert
    expect(order).toEqual([nodeName]);
  });
});
