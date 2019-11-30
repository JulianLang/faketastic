import { copyAttributes, ObjectTreeNode, treeOf } from 'treelike';
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
  const initOneOf = createProcessorFn(
    initOneOfImpl,
    'preprocessor',
    ProcessorOrders.treeStructureChanging,
  );

  return {
    [BuildableSymbol]: 'value',
    processors: [initOneOf, ...processorFns],
    value: null,
  };

  function initOneOfImpl(node: ObjectTreeNode) {
    const content = chooseRandomItem();
    const contentRoot = treeOf(content, childSelector);
    contentRoot.name = node.name;

    copyAttributes(contentRoot, node);
  }

  function chooseRandomItem() {
    if (!isDefined(values)) {
      throw new Error(
        'Cannot get "oneOf(undefined, …)". First parameter of "oneOf" function must not be null or undefined, but an array.',
      );
    }

    const index = randomInt(0, values.length - 1);
    const clonedValue = clone(values[index]);

    return clonedValue;
  }
}
