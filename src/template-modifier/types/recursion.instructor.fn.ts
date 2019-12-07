import { Func } from '../../types';
import { RecursionInstruction } from './recursion.instruction';

/**
 * Recursion Instructor function, telling the `withRecursion` function when to stop,
 * and with what value to stop the recursion. These function are mandatory to avoid
 * infinite recursive loops.
 */
export type RecursionInstructorFn<T = any> =
  | SimpleRecursionInstructor<T>
  | Func<[T], SimpleRecursionInstructor<T>>;
type SimpleRecursionInstructor<T> = Func<[T], RecursionInstruction>;
