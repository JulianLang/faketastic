import { isDefined } from '../../util';
import { BuildCycle, ProcessorFn, ProcessorFnSymbol } from '../types';

export function isProcessorFn(fn: any, forCycle?: BuildCycle): fn is ProcessorFn {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isDefined(forCycle)) {
    return (fn as any)[ProcessorFnSymbol] === forCycle;
  } else {
    return isDefined((fn as any)[ProcessorFnSymbol]);
  }
}
