import { ReadType } from '..';
import { MutationFnReadType, TimeOfExecution, Type, Types } from '../../constants';
import { Func } from '../../types';
import { setSymbol } from '../../util';
import { ProcessorFn } from '../attached.fn';
import { ExecutionTime } from '../execution.time';

/**
 * Marks a given function as faketastic-`ProcessorFn`.
 * @param fn The function to mark as `ProcessorFn`.
 * @param executionTime The moment in time when to execute the function.
 * @param readType The desired input-argument type of the function. Defaults to 'value'.
 */
export function createProcessorFn(
  fn: Func<[any], any>,
  executionTime: ExecutionTime,
  readType: ReadType = 'value',
): ProcessorFn {
  const scheduledFn = setSymbol(TimeOfExecution, fn, executionTime);
  const typedFn = setSymbol(Type, scheduledFn, Types.ProcessorFn);

  return setSymbol(MutationFnReadType, typedFn, readType);
}
