import { ObjectTreeNode } from 'object-tree';
import {
  Buildable,
  BuildableSymbol,
  buildDynamicTemplate,
  createProcessorFn,
  PureObject,
  unwrapIfBuildable,
} from '../core';
import { createBuildable } from '../core/built-in/specs/shared/spec.helper';

export function combine<T extends PureObject<any>>(
  props: T,
  map: (props: T) => any,
): Buildable<any> {
  const extractValuesProcessor = createProcessorFn(extractValues, 'finalizer');

  return {
    [BuildableSymbol]: 'value',
    value: props,
    processors: [extractValuesProcessor],
  };

  function extractValues(node: ObjectTreeNode<T>) {
    const unwrapped = unwrapIfBuildable(node.value);
    const buildable = createBuildable(unwrapped, []);
    buildDynamicTemplate(buildable, node);

    const builtProps = node.value;
    const mappedValue = map(builtProps);

    // remove children
    node.children = [];
    node.value = mappedValue;
  }
}
