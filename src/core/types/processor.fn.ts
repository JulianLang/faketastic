import { BuildCycle } from './build.cycle';
import { IsStickyProcessorSymbol, ProcessorOrderSymbol, ProcessorSymbol } from './symbols';

export interface ProcessorFn {
  [ProcessorSymbol]: BuildCycle;
  [ProcessorOrderSymbol]: number;
  [IsStickyProcessorSymbol]: boolean;

  (...params: any[]): void;
}
