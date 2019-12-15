import { ObjectTreeNode } from 'treelike';
import { BuildCycle, FnBuildCycleSymbol, FnOrderSymbol } from '../../core';
import { AttachedFn } from '../../types';

export interface ArchitectFn extends AttachedFn {
  [FnBuildCycleSymbol]: BuildCycle;
  [FnOrderSymbol]: number;
  (node: ObjectTreeNode): void;
}
