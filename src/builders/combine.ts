import { ObjectTreeNode } from 'object-tree';
import { ProcessorPriorities } from '../constants/processor.priorities';
import {
  Buildable,
  BuildableSymbol,
  buildDynamicTemplate,
  createProcessorFn,
  isBuildable,
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
    // TODO: langju: should `props` be cloned? Wait for bug until August 2020. Then remove this todo.
    value: props,
    processors: [...processors, extractValuesProcessor],
  };

  function extractValues(node: ObjectTreeNode<T>) {
    const builtValues = node.value;
    const buildable = isBuildable(builtValues) ? builtValues : createBuildable(builtValues, []);
    buildDynamicTemplate(buildable, node);

    const builtProps = node.value as PureObject<T>;
    const mappedValue = map(builtProps);

    // remove children as they should not get merged into the final value:
    node.children = [];

    node.value = mappedValue;
  }
}
