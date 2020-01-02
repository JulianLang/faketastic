import {
  AttachedFnSymbol,
  BuildCycle,
  BuildCycleCallbackFn,
  FnBuildCycleSymbol,
  FnIsStickySymbol,
  FnOrderSymbol,
} from '../../core';
import { Stickiness } from '../../types';
import { ProcessorFn } from '../types';

export function createProcessorFn(
  fn: BuildCycleCallbackFn,
  cycle: BuildCycle,
  sticky: Stickiness = 'unsticky',
  orderNumber = 0,
): ProcessorFn {
  const processorFn = fn as ProcessorFn;
  processorFn[AttachedFnSymbol] = 'processor';
  processorFn[FnBuildCycleSymbol] = cycle;
  processorFn[FnOrderSymbol] = orderNumber;

  if (sticky === 'sticky') {
    processorFn[FnIsStickySymbol] = true;
  }

  return fn as ProcessorFn;
}
