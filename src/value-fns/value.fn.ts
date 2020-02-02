import { Type, Types } from '../constants';

/**
 * Value functions continuously return randomized values of a certain type. Often accepts parameters
 * that restricts the return value in a certain way (e.g. number bounds/ranges). They work similiar
 * to generator functions in javascript, but without the ability to be enumerated.
 */
export interface ValueFn<T = any> {
  [Type]: typeof Types.ValueFn;
  (): T;
}
