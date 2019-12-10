import { ObjectTreeNode } from 'treelike';
import { MutatingFnOrders } from '../constants';
import { Buildable, buildChild, createBuildable, createProcessorFn, PureObject } from '../core';
import { placeholder } from '../placeholder';
import { AttachedFn } from '../types';
import { clone } from '../util';

export function combine<T>(
  props: PureObject<T>,
  map: (props: PureObject<T>) => any,
  ...attachedFns: AttachedFn[]
): Buildable<any> {
  const combineValuesProcessor = createProcessorFn(
    buildAndCombineValues,
    'finalizer',
    MutatingFnOrders.processors.combineValues,
  );

  return createBuildable(placeholder(), [combineValuesProcessor, ...attachedFns]);

  function buildAndCombineValues(node: ObjectTreeNode<Buildable<T>>) {
    const clonedProps = clone(props);
    // TODO: langju: this will execute processors multiple times? what if it contains quantity() for example?
    const buildable: Buildable<T> = createBuildable(clonedProps, attachedFns);
    const builtTemplate = buildChild(buildable, node);
    const mappedValue = map(builtTemplate);
    node.value = mappedValue;
  }
}
