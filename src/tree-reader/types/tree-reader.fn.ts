import { ObjectTreeNode } from 'treelike';
import { BuildCycle } from '../../core';

export const TreeReaderFnSymbol = Symbol('faketastic.fns.tree-reader');

export interface TreeReaderFn {
  [TreeReaderFnSymbol]: BuildCycle;
  (node: ObjectTreeNode): void;
}
