import { ObjectTreeNode } from 'treelike';
import { BuildCycle, FnBuildCycleSymbol, FnOrderSymbol } from '../../core/types';
import { AttachedFn } from '../../types';

// TODO: move.
export const IsStickyProcessorSymbol = Symbol('faketastic.fns.isSticky');

export interface ProcessorFn extends AttachedFn {
  [FnBuildCycleSymbol]: BuildCycle;
  [FnOrderSymbol]: number;
  [IsStickyProcessorSymbol]: boolean;
  (node: ObjectTreeNode): void;
}
