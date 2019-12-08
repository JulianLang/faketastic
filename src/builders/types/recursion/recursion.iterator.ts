import { Func } from '../../../types';
import { IterationState } from './iterator.state';

/**
 * Recursion Instructor function, telling the `withRecursion` function when to stop,
 * and with what value to stop the recursion. These function are mandatory to avoid
 * infinite recursive loops.
 */
export type RecursionIterator<T = any> =
  | SimpleRecursionIterator<T>
  | Func<[T], SimpleRecursionIterator<T>>;
type SimpleRecursionIterator<T> = Func<[T], IterationState>;
