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
import { placeholder } from '../placeholder';
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
    value: placeholder(),
    processors: [...processors, combineValuesProcessor],
  };

  function buildAndCombineValues(node: ObjectTreeNode<Buildable<T>>) {
    const clonedProps = clone(props);
    // TODO: langju: this will execute processors multiple times? what if it contains quantity() for example?
    const buildable: Buildable<T> = createBuildable(clonedProps, processors);
    const builtTemplate = build(buildable);
    const mappedValue = map(builtTemplate);
    node.value = mappedValue;
  }
}
