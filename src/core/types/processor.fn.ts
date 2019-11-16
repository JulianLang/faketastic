import { ProcessorType } from './processor.types';
import { ProcessorOrderSymbol, ProcessorSymbol } from './symbols';

export interface ProcessorFn {
  [ProcessorSymbol]: ProcessorType;
  [ProcessorOrderSymbol]: number;

  (...params: any[]): void;
}
