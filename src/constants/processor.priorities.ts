import { Dictionary } from '../core';

/**
 * **Contains priorities for processor functions.**
 *
 * The higher the priority number, the earlier the processor gets executed.
 * Any processor function that has no processor priorization assigned,
 * has a priority of 0 by default.
 *
 * ---
 *
 * **Note:** You can also assign a priority to your processor function by
 * using the `createProcessorFn`-method and specifying the third parameter.
 *
 * ---
 *
 * **Note:** It is possible to assign negative priority numbers.
 * The execution of functions with negative priorities gets postponed,
 * according to their value.
 *
 * ---
 *
 * **Note:** Priorities are only applicable in the build-cycle of its processor
 * function. The priority will have no effects on other build-cycles than
 * the one of the respective processor function.
 */
export const ProcessorPriorities: Dictionary<number> = {
  // initializer
  // preprocessors
  // postprocessors
  // finalizer
  combineValueExtract: 20,
  ref: 4000,
  map: 4010,
} as const;
