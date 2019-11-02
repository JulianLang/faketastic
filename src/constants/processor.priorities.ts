import { Dictionary } from '../core';
/**
 * Defines priorities for processor functions represented as a number.
 * The higher the priority number, the earlier the processor gets executed.
 * Any processor function that has no processor priorization assigned,
 * has a priority of 0 by default.
 *
 * Note: It is also possible to assign negative priority numbers.
 * The execution of functions with negative priorities gets postponed,
 * according to their value.
 *
 * Note: Priorities are only applicable in the build-cycle of its processor
 * function. The priority will have no effects on other build-cycles than
 * the cycle of the function.
 */
export const ProcessorPriorities: Dictionary<number> = {
  // initializer
  // preprocessors
  // postprocessors
  // finalizer
  ref: 4000,
  map: 4010,
} as const;
