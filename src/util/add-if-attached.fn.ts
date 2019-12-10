import { isProcessorFn } from '../processors/util/is-processor.fn';
import { AttachedFn } from '../types';

/**
 * Adds the given parameter to the specified `AttachedFn` array, if itself is a `AttachedFn`.
 * The method returns a boolean, indicating whether the parameter has been added to the array.
 * @param parameter The parameter to check if its type is `AttachedFn`
 * @param to The `AttachedFn` array to add the parameter to, if it is a `AttachedFn`.
 */
export function addIfAttachedFn(parameter: any, to: AttachedFn[]): boolean {
  const isProcessor = isProcessorFn(parameter);

  if (isProcessor) {
    to.push(parameter);
  }

  return isProcessor;
}
