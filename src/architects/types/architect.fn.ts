import { ObjectTreeNode } from 'treelike';
import { ArchitectFnSymbol, BuildCycle, FnOrderSymbol } from '../../core';

export interface ArchitectFn {
  [ArchitectFnSymbol]: BuildCycle;
  [FnOrderSymbol]: number;
  (node: ObjectTreeNode): void;
}
