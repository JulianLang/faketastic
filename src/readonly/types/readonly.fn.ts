import { ObjectTreeNode } from 'treelike';
import { BuildCycle } from '../../core';

export const ReadonlyFnSymbol = Symbol('faketastic.fns.readonly');

export interface ReadonlyFn {
  [ReadonlyFnSymbol]: BuildCycle;
  (node: ObjectTreeNode): void;
}
