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
  const extractValuesProcessor = createProcessorFn(
    extractValues,
    'finalizer',
    ProcessorPriorities.combineValueExtract,
  );

  return {
    [BuildableSymbol]: 'value',
    value: {},
    processors: [...processors, extractValuesProcessor],
  };

  function extractValues(node: ObjectTreeNode<Buildable<T>>) {
    const buildable: Buildable<T> = createBuildable(props, processors);
    const builtTemplate = buildDynamicTemplate(buildable, node);
    const mappedValue = map(builtTemplate);

    node.value = mappedValue;
  }
}
