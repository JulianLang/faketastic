import { ObjectTreeNode } from 'treelike';
import { ProcessorPriorities } from '../constants/processor.priorities';
import {
  Buildable,
  BuildableSymbol,
  buildDynamicTemplate,
  createProcessorFn,
  ProcessorFn,
  PureObject,
} from '../core';
import { createBuildable } from '../core/built-in/specs/shared/spec.helper';

export function combine<T>(
  props: PureObject<T>,
  map: (props: PureObject<T>) => any,
  ...processors: ProcessorFn[]
): Buildable<any> {
  const combineValuesProcessor = createProcessorFn(
    buildAndCombineValues,
    'finalizer',
    ProcessorPriorities.combineValues,
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
