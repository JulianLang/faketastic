import { ObjectTreeNode } from 'object-tree';
import { ProcessorPriorities } from '../constants/processor.priorities';
import {
  Buildable,
  BuildableSymbol,
  buildDynamicTemplate,
  clone,
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
    value: clone(props),
    processors: [...processors, extractValuesProcessor],
  };

  function extractValues(node: ObjectTreeNode<Buildable<T>>) {
    const buildable: Buildable<T> = createBuildable(props, processors);
    const builtTemplate = buildDynamicTemplate(buildable, node);
    const mappedValue = map(builtTemplate);

    // remove children as they should not get merged into the final value:
    node.children = [];

    node.value = mappedValue;
  }
}
