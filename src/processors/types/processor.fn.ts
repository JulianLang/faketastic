import { ObjectTreeNode } from 'treelike';
import { BuildCycle, FnBuildCycleSymbol, FnIsStickySymbol, FnOrderSymbol } from '../../core/types';
import { AttachedFn } from '../../types';

export interface ProcessorFn extends AttachedFn {
  [FnBuildCycleSymbol]: BuildCycle;
  [FnOrderSymbol]: number;
  [FnIsStickySymbol]: boolean;
  (node: ObjectTreeNode): void;
}
