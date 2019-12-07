import { Stickiness } from '../../types';
import {
  IsStickyProcessorSymbol,
  ProcessorFn,
  ProcessorOrderSymbol,
  ProcessorSymbol,
  ProcessorType,
} from '../types';

export function createProcessorFn(
  fn: Function,
  type: ProcessorType,
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
