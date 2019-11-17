import { ProcessorSymbol, ProcessorType } from '../types';
import { isDefined } from './is-defined';

export function isProcessorFn(fn: Function, ofType?: ProcessorType): boolean {
  if (isDefined(ofType)) {
    return (fn as any)[ProcessorSymbol] === ofType;
  } else {
    return isDefined((fn as any)[ProcessorSymbol]);
  }
}
