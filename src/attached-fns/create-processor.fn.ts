import { TimeOfExecution, Type, Types } from '../constants';
import { Func } from '../types';
import { setSymbol } from '../util';
import { ProcessorFn } from './attached.fn';
import { ExecutionTime } from './execution.time';

/**
 * Marks a given function as faketastic-`ProcessorFn`.
 * @param fn The function to mark as `ProcessorFn`.
 */
export function createProcessorFn(fn: Func<[any], any>, executionTime: ExecutionTime): ProcessorFn {
  const scheduledFn = setSymbol(TimeOfExecution, fn, executionTime);

  return setSymbol(Type, scheduledFn, Types.ProcessorFn);
}
