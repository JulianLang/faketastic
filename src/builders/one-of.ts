import { copyAttributes, ObjectTreeNode, replace, treeOf } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  Buildable,
  BuildableSymbol,
  childSelector,
  createProcessorFn,
  ProcessorFn,
  randomInt,
} from '../core';
import { clone, isDefined } from '../util';

export function oneOf(values: any[], ...processorFns: ProcessorFn[]): Buildable<any> {
  const initOneOf = createProcessorFn(init, 'initializer', ProcessorOrders.treeStructureChanging);

  return {
    [BuildableSymbol]: 'value',
    value: null,
    processors: [initOneOf, ...processorFns],
  };

  function init(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const contentRoot = treeOf(content, childSelector);

    if (isDefined(node.parent)) {
      contentRoot.name = node.name;
      replace(node, contentRoot);
    } else {
      copyAttributes(contentRoot, node);
    }
  }

  function chooseRandomItem() {
    if (!isDefined(values)) {
      throw new Error(
        'Cannot get "oneOf(undefined, …)". First parameter of "oneOf" function must not be null or undefined, but an array.',
      );
    }

    const index = randomInt(0, values.length - 1);

    return clone(values[index]);
  }
}
