import { BuildCycle } from './build.cycle';
import { IsStickyProcessorSymbol, ProcessorFnSymbol, ProcessorOrderSymbol } from './symbols';

export interface ProcessorFn {
  [ProcessorFnSymbol]: BuildCycle;
  [ProcessorOrderSymbol]: number;
  [IsStickyProcessorSymbol]: boolean;

  (...params: any[]): void;
}
