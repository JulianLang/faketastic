import { ProcessorSymbol, ProcessorType } from '../types';

export function createProcessorFn(fn: Function, type: ProcessorType): Function {
  (fn as any)[ProcessorSymbol] = type;

  return fn;
}
