import { ProcessorType } from './processor.types';
import { IsStickyProcessorSymbol, ProcessorOrderSymbol, ProcessorSymbol } from './symbols';

export interface ProcessorFn {
  [ProcessorSymbol]: ProcessorType;
  [ProcessorOrderSymbol]: number;
  [IsStickyProcessorSymbol]: boolean;

  (...params: any[]): void;
}
