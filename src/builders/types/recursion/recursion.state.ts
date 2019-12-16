/** Instruction telling the `withRecursion` function when to stop, and with what value to stop. */
export interface RecursionState<T = any> {
  continue?: boolean;
  endWithValue?: T;
}
