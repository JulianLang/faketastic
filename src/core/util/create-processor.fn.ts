import { PrioritySymbol, ProcessorFn, ProcessorSymbol, ProcessorType } from '../types';

export function createProcessorFn(fn: Function, type: ProcessorType, priority = 0): ProcessorFn {
  (fn as any)[ProcessorSymbol] = type;
  (fn as any)[PrioritySymbol] = priority;

  return fn as ProcessorFn;
}
