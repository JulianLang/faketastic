import { isDefined } from '../../util';
import { BuildCycle, ProcessorFn, ProcessorSymbol } from '../types';

export function isProcessorFn(fn: any, forCycle?: BuildCycle): fn is ProcessorFn {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isDefined(forCycle)) {
    return (fn as any)[ProcessorSymbol] === forCycle;
  } else {
    return isDefined((fn as any)[ProcessorSymbol]);
  }
}
