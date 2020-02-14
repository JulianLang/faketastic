import { findNode, isDefined, ObjectTreeNode, parentTraverser, TraverseCallbackFn } from 'treelike';
import { AttachedFn, createReaderFn } from '../attached-fns';
import { Buildable, createBuildable, getAttachedProperty } from '../buildable';
import { getRawValue } from '../builder';
import { Types } from '../constants';
import AP from '../constants/attached.properties';
import { Func } from '../types';
import { setType } from '../util';

export function ref(target: any, ...attachedFns: AttachedFn[]) {
  function refReader(node: ObjectTreeNode) {
    const buildable: Buildable = node.value;
    const { targetSelectorFn, traverseStrategy } = tryGetAttachedProperties(target, buildable);

    const result = findNode(node, n => targetSelectorFn(n, target), traverseStrategy);

    if (isDefined(result)) {
      const referenceFn = setType(Types.ReferenceFn, () => getRawValue(result?.value));
      buildable.value = referenceFn;
    }
  }

  const readerFn = createReaderFn(refReader);
  return createBuildable(undefined, [readerFn, ...attachedFns]);
}

function tryGetAttachedProperties(target: any, buildable: Buildable) {
  const defaultSelectorFn = (n: ObjectTreeNode) => n.name === target;
  const targetSelectorFn: Func<[ObjectTreeNode, any], boolean> =
    getAttachedProperty(AP.ref.targetSelector, buildable) ?? defaultSelectorFn;

  const traverseStrategy: TraverseCallbackFn =
    getAttachedProperty(AP.ref.traversingStrategy, buildable) ?? parentTraverser;

  return { targetSelectorFn, traverseStrategy };
}
