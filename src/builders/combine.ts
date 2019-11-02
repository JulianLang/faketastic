import { ObjectTreeNode } from 'object-tree';
import {
  Buildable,
  BuildableSymbol,
  buildDynamicTemplate,
  createProcessorFn,
  isBuildable,
  PureObject,
} from '../core';
import { createBuildable } from '../core/built-in/specs/shared/spec.helper';

export function combine<T>(
  props: PureObject<T>,
  map: (props: PureObject<T>) => any,
): Buildable<any> {
  const extractValuesProcessor = createProcessorFn(extractValues, 'finalizer');

  return {
    [BuildableSymbol]: 'value',
    // TODO: langju: should `props` be cloned? Wait for bug until August 2020. Then remove this todo.
    value: props,
    processors: [extractValuesProcessor],
  };

  function extractValues(node: ObjectTreeNode<T>) {
    const builtValues = node.value;
    const buildable = isBuildable(builtValues) ? builtValues : createBuildable(builtValues, []);
    buildDynamicTemplate(buildable, node);

    const builtProps = node.value as PureObject<T>;
    const mappedValue = map(builtProps);

    // remove children
    node.children = [];
    node.value = mappedValue;
  }
}
