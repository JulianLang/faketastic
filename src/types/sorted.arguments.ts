import { AttachedFn } from '../attached-fns';

/** Defines the interface of sorted arguments. This is the return type of the function `sortArgsByType`. */
export interface SortedArguments<T = any> {
  attachedFns: AttachedFn[];
  args: T;
}
