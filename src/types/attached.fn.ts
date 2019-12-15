import { ObjectTreeNode } from 'treelike';
import { AttachedFnSymbol } from '../core';
import { AttachedFnType } from './attached.fn.type';

/** AttachedFns are supported functions to be placed within a TemplateFn or DirectiveFn. */
export interface AttachedFn {
  [AttachedFnSymbol]: AttachedFnType;
  (node: ObjectTreeNode): void;
}
