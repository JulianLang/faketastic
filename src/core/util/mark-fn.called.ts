import { ObjectTreeNode } from 'treelike';
import { setSymbol } from '../../util';
import { BuildCycleCallbackFn, FnCalledSymbol } from '../types';

/**
 * Marks an AttachedFn as called for the given node. This prevents running the same AttachedFn
 * multiple times on the same node, for example when nodes were multiplied with `quantity()`.
 * @param fn The very function that was run and should be mark as called.
 * @param node The node on which the AttachedFn was run.
 */
export function markFnCalled(fn: BuildCycleCallbackFn, node: ObjectTreeNode) {
  setSymbol(FnCalledSymbol, fn, node);
}
