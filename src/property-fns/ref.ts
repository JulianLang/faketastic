import { findNode, isDefined, ObjectTreeNode, parentTraverser } from 'treelike';
import { AttachedFn, createReaderFn } from '../attached-fns';
import { Buildable, createBuildable } from '../buildable';
import { getRawValue } from '../builder';
import { Types } from '../constants';
import AP from '../constants/attached.properties';
import { setType } from '../util';
import { createValueFn } from '../value-fns';

export function ref(property: string, ...attachedFns: AttachedFn[]) {
  function refReader(node: ObjectTreeNode) {
    const result = findNode(node, n => n.name === property, parentTraverser);

    if (isDefined(result)) {
      const buildable: Buildable = node.value;
      const referenceFn = setType(Types.ReferenceFn, () => getRawValue(result?.value));
      buildable.attachedProperties[AP.ref.resolvedValue] = referenceFn;
    }
  }

  function refImpl(buildable: Buildable) {
    return buildable.attachedProperties[AP.ref.resolvedValue];
  }

  const readerFn = createReaderFn(refReader);
  const valueFn = createValueFn(refImpl);
  return createBuildable(valueFn, [readerFn, ...attachedFns]);
}
