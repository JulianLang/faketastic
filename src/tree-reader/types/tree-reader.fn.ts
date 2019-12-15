import { ObjectTreeNode } from 'treelike';
import { BuildCycle, FnBuildCycleSymbol } from '../../core';
import { AttachedFn } from '../../types';

export interface TreeReaderFn extends AttachedFn {
  [FnBuildCycleSymbol]: BuildCycle;
  (node: ObjectTreeNode): void;
}
