import { TimeOfExecution, Types } from '../../constants';
import { getSymbol, isDefined, isType } from '../../util';
import { ProcessorFn } from '../attached.fn';
import { ExecutionTime } from '../execution.time';

/**
 * Determines whether a given value is a `ProcessorFn`. Can optionally check for the time of execution as well.
 * @param fn The function to check if it is a `ProcessorFn`.
 * @param withTimeOfExecution (Optional) When provided, it checks if the time of execution matches the given value.
 */
export function isProcessorFn(fn: any, withTimeOfExecution?: ExecutionTime): fn is ProcessorFn {
  if (!isType(fn, Types.ProcessorFn)) {
    return false;
  }

  return isDefined(withTimeOfExecution)
    ? getSymbol(TimeOfExecution, fn) === withTimeOfExecution
    : true;
}
