import {
  AttachedFnSymbol,
  BuildCycle,
  FnBuildCycleSymbol,
  FnIsStickySymbol,
  FnOrderSymbol,
} from '../../core/types';
import { BuildCycleCallbackFn, Stickiness } from '../../types';
import { ProcessorFn } from '../types';

export function createProcessorFn(
  fn: BuildCycleCallbackFn,
  cycle: BuildCycle,
  orderNumber = 0,
  sticky: Stickiness = 'sticky',
): ProcessorFn {
  const processorFn: ProcessorFn = fn as ProcessorFn;
  processorFn[AttachedFnSymbol] = 'processor';
  processorFn[FnBuildCycleSymbol] = cycle;
  processorFn[FnOrderSymbol] = orderNumber;

  if (sticky === 'sticky') {
    processorFn[FnIsStickySymbol] = true;
  }

  return fn as ProcessorFn;
}
