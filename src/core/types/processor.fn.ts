import { ObjectTreeNode } from 'treelike';
import { BuildCycle } from './build.cycle';
import { FnOrderSymbol, IsStickyProcessorSymbol, ProcessorFnSymbol } from './symbols';

export interface ProcessorFn {
  [ProcessorFnSymbol]: BuildCycle;
  [FnOrderSymbol]: number;
  [IsStickyProcessorSymbol]: boolean;
  (node: ObjectTreeNode): void;
}
