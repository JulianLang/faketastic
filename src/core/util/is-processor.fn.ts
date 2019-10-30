import { ProcessorSymbol, ProcessorType } from '../types';
import { isDefined } from './type.helper';

export function isProcessorFn(fn: Function, ofType?: ProcessorType): boolean {
  if (isDefined(ofType)) {
    return (fn as any)[ProcessorSymbol] === ofType;
  } else {
    return isDefined((fn as any)[ProcessorSymbol]);
  }
}
