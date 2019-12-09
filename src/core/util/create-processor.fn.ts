import { BuildCycleCallbackFn, Stickiness } from '../../types';
import {
  BuildCycle,
  FnOrderSymbol,
  IsStickyProcessorSymbol,
  ProcessorFn,
  ProcessorFnSymbol,
} from '../types';

export function createProcessorFn(
  fn: BuildCycleCallbackFn,
  type: BuildCycle,
  orderNumber = 0,
  sticky: Stickiness = 'sticky',
): ProcessorFn {
  const processorFn: ProcessorFn = fn as ProcessorFn;
  processorFn[ProcessorFnSymbol] = type;
  processorFn[FnOrderSymbol] = orderNumber;

  if (sticky === 'sticky') {
    processorFn[IsStickyProcessorSymbol] = true;
  }

  return fn as ProcessorFn;
}
