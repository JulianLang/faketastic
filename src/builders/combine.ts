import { ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  Buildable,
  BuildableSymbol,
  buildDynamicTemplate,
  createBuildable,
  createProcessorFn,
  ProcessorFn,
  PureObject,
} from '../core';

export function combine<T>(
  props: PureObject<T>,
  map: (props: PureObject<T>) => any,
  ...processors: ProcessorFn[]
): Buildable<any> {
  const combineValuesProcessor = createProcessorFn(
    buildAndCombineValues,
    'finalizer',
    ProcessorOrders.combineValues,
  );

  return {
    [BuildableSymbol]: 'value',
    value: null,
    processors: [...processors, combineValuesProcessor],
  };

  function buildAndCombineValues(node: ObjectTreeNode<Buildable<T>>) {
    const buildable: Buildable<T> = createBuildable(props, processors);
    const builtTemplate = buildDynamicTemplate(buildable, node);
    const mappedValue = map(builtTemplate);

    node.value = mappedValue;
  }
}
