import { ProcessorType } from './processor.types';
import { PrioritySymbol, ProcessorSymbol } from './symbols';

export interface ProcessorFn {
  [ProcessorSymbol]: ProcessorType;
  [PrioritySymbol]: number;

  (...params: any[]): void;
}
