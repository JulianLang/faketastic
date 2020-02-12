import { findNode, ObjectTreeNode, parentTraverser } from 'treelike';
import { AttachedFn, createReaderFn } from '../attached-fns';
import { Buildable, createBuildable } from '../buildable';
import { getRawValue } from '../builder';
import { Types } from '../constants';
import AP from '../constants/attached.properties';
import { isUndefined, setType } from '../util';
import { createValueFn } from '../value-fns';

export function ref(property: string, ...attachedFns: AttachedFn[]) {
  function refReader(node: ObjectTreeNode) {
    let result = findNode(
      node,
      n => {
        return n.name === property;
      },
      parentTraverser,
    );

    if (isUndefined(result)) {
      console.warn(`faketastic: Could not resolve reference to "${property}"`);
      // TODO: langju: set result = UnsetValue or Placeholder...
    }

    const buildable: Buildable = node.value;

    const referenceFn = setType(Types.ReferenceFn, () => getRawValue(result?.value));
    buildable.attachedProperties[AP.ref.resolvedValue] = referenceFn;
  }

  function refImpl(buildable: Buildable) {
    return buildable.attachedProperties[AP.ref.resolvedValue];
  }

  const readerFn = createReaderFn(refReader);
  const valueFn = createValueFn(refImpl);
  return createBuildable(valueFn, [readerFn, ...attachedFns]);
}