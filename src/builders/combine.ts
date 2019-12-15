import { ObjectTreeNode } from 'treelike';
import { MutatingFnOrders, UnsetValue } from '../constants';
import { Buildable, buildChild, createBuildable, markFnCalled, PureObject } from '../core';
import { createProcessorFn } from '../processors';
import { AttachedFn } from '../types';
import { clone } from '../util';

export function combine<T>(
  props: PureObject<T>,
  map: (props: PureObject<T>) => any,
  ...attachedFns: AttachedFn[]
): Buildable {
  const combineValuesProcessor = createProcessorFn(
    buildAndCombineValues,
    'finalizer',
    MutatingFnOrders.processors.combineValues,
  );

  return createBuildable(UnsetValue, [combineValuesProcessor, ...attachedFns]);

  function buildAndCombineValues(node: ObjectTreeNode<Buildable<T>>) {
    const clonedProps = clone(props);
    // TODO: langju: this will execute processors multiple times? what if it contains quantity() for example?
    const buildable: Buildable<T> = createBuildable(clonedProps, attachedFns);
    const builtTemplate = buildChild(buildable, node);
    const mappedValue = map(builtTemplate);
    node.value = mappedValue;

    markFnCalled(buildAndCombineValues, node);
  }
}
