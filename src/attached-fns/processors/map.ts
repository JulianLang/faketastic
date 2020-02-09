import { Func } from '../../types';
import { createProcessorFn } from '../util/create-processor.fn';

/**
 * Maps the value (after building the property) onto another by calling the given mapper-function.
 *
 * ---
 *
 * type: Postprocessor
 *
 * ---
 * @param mapFn The map-function mapping the property's current value onto another.
 */
export function map(mapFn: Func<[any], any>) {
  function mapImpl(value: any) {
    return mapFn(value);
  }

  return createProcessorFn(mapImpl, 'postbuild');
}
