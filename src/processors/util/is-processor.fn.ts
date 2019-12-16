import { AttachedFnSymbol, BuildCycle, FnBuildCycleSymbol } from '../../core';
import { hasSymbol, isDefined } from '../../util';
import { ProcessorFn } from '../types';

export function isProcessorFn(fn: any, forCycle?: BuildCycle): fn is ProcessorFn {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isDefined(forCycle)) {
    return hasSymbol(AttachedFnSymbol, fn) && hasSymbol(FnBuildCycleSymbol, fn, forCycle);
  } else {
    return hasSymbol(AttachedFnSymbol, fn);
  }
}
