/** Instruction telling the `withRecursion` function when to stop, and with what value to stop. */
export interface IterationState<T = any> {
  continue?: boolean;
  endWithValue?: T;
}
