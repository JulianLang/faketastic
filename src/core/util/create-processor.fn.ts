import { Stickiness } from '../../types';
import {
  BuildCycle,
  IsStickyProcessorSymbol,
  ProcessorFn,
  ProcessorOrderSymbol,
  ProcessorSymbol,
} from '../types';

export function createProcessorFn(
  fn: Function,
  type: BuildCycle,
  orderNumber = 0,
  sticky: Stickiness = 'sticky',
): ProcessorFn {
  const processorFn: ProcessorFn = fn as ProcessorFn;
  processorFn[ProcessorSymbol] = type;
  processorFn[ProcessorOrderSymbol] = orderNumber;

  if (sticky === 'sticky') {
    processorFn[IsStickyProcessorSymbol] = true;
  }

  return fn as ProcessorFn;
}
