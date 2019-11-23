import { ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  build,
  Buildable,
  BuildableSymbol,
  createBuildable,
  createProcessorFn,
  ProcessorFn,
  PureObject,
} from '../core';
import { clone } from '../util';

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
    const clonedProps = clone(props);
    const buildable: Buildable<T> = createBuildable(clonedProps, processors);
    const builtTemplate = build(buildable);
    const mappedValue = map(builtTemplate);
    node.value = mappedValue;
  }
}
