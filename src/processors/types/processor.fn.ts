import { ObjectTreeNode } from 'treelike';
import { BuildCycle } from '../../core/types/build.cycle';
import { FnOrderSymbol } from '../../core/types/symbols';

export const ProcessorFnSymbol = Symbol('faketastic.fns.processor');
export const IsStickyProcessorSymbol = Symbol('faketastic.fns.processor.isSticky');

export interface ProcessorFn {
  [ProcessorFnSymbol]: BuildCycle;
  [FnOrderSymbol]: number;
  [IsStickyProcessorSymbol]: boolean;
  (node: ObjectTreeNode): void;
}
