import { ObjectTreeNode } from 'treelike';
import { ArchitectFnSymbol, BuildCycle } from '../../core';

export interface ArchitectFn {
  [ArchitectFnSymbol]: BuildCycle;
  (node: ObjectTreeNode): void;
}
