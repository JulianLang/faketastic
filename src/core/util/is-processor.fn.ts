import { isDefined } from '../../util';
import { ProcessorFn, ProcessorSymbol, ProcessorType } from '../types';

export function isProcessorFn(fn: any, ofType?: ProcessorType): fn is ProcessorFn {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isDefined(ofType)) {
    return (fn as any)[ProcessorSymbol] === ofType;
  } else {
    return isDefined((fn as any)[ProcessorSymbol]);
  }
}
