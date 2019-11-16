import { ProcessorFn, ProcessorOrderSymbol, ProcessorSymbol, ProcessorType } from '../types';

export function createProcessorFn(fn: Function, type: ProcessorType, orderNumber = 0): ProcessorFn {
  (fn as any)[ProcessorSymbol] = type;
  (fn as any)[ProcessorOrderSymbol] = orderNumber;

  return fn as ProcessorFn;
}
