import { ObjectTreeNode } from 'treelike';
import { AttachedFn, createReaderFn } from '../attached-fns';
import { Buildable, createBuildable } from '../buildable';
import AP from '../constants/attached.properties';
import { createValueFn } from '../value-fns';

export function ref(property: string, ...attachedFns: AttachedFn[]) {
  function refReader(node: ObjectTreeNode) {
    // let result = findNode(node, n => n.name === property, parentTraverser);
    // if (isUndefined(result)) {
    //   console.warn(`faketastic: Could not resolve reference to "${property}"`);
    //   // TODO: langju: set result = UnsetValue or Placeholder...
    // }
    // const buildable: Buildable = node.value;
    // buildable.attachedProperties[AP.ref.resolvedValue] = getRawValue(result?.value);
    let root = node;
    while (root && root.parent) {
      root = root.parent;
    }
    '';
  }

  function refImpl(buildable: Buildable) {
    return () => buildable.attachedProperties[AP.ref.resolvedValue];
  }

  const readerFn = createReaderFn(refReader);
  const valueFn = createValueFn(refImpl);
  return createBuildable(valueFn, [readerFn, ...attachedFns]);
}
