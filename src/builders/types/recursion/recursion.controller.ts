import { Func } from '../../../types';
import { RecursionState } from './recursion.state';

/**
 * Recursion controlling function, telling the `self` function when to stop,
 * and with what value to stop the recursion. These function are mandatory to avoid
 * infinite recursive loops.
 */
export type RecursionController<T = any> =
  | SimpleRecursionController<T>
  | Func<[T], SimpleRecursionController<T>>;
type SimpleRecursionController<T> = Func<[T], RecursionState>;
