import { isDefined } from '../../util';
import { ProcessorSymbol, ProcessorType } from '../types';

export function isProcessorFn(fn: Function, ofType?: ProcessorType): boolean {
  if (isDefined(ofType)) {
    return (fn as any)[ProcessorSymbol] === ofType;
  } else {
    return isDefined((fn as any)[ProcessorSymbol]);
  }
}
