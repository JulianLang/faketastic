import { nodeTypeOf, ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  asBuildable,
  build,
  Buildable,
  BuildableSymbol,
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
    const buildableContent = asBuildable(content);
    const builtContent = build(buildableContent);

    node.value = builtContent;
    node.type = nodeTypeOf(builtContent);
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
