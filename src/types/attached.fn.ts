import { ObjectTreeNode } from 'treelike';
import { AttachedFnSymbol, BuildCycle, FnBuildCycleSymbol } from '../core';
import { AttachedFnType } from './attached.fn.type';

/** AttachedFns are supported functions to be placed within a TemplateFn or DirectiveFn. */
export interface AttachedFn {
  [AttachedFnSymbol]: AttachedFnType;
  [FnBuildCycleSymbol]: BuildCycle;
  (node: ObjectTreeNode): void;
}
