/** Instruction telling the `withRecursion` function when to stop, and with what value to stop. */
export interface RecursionInstruction<T = any> {
  continue?: boolean;
  endWithValue?: T;
}
