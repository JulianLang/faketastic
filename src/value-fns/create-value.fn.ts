import { Buildable } from '../buildable';
import { Type, Types } from '../constants';
import { Func } from '../types';
import { setSymbol } from '../util';
import { ValueFn } from './value.fn';

/**
 * Marks a given function as a faketastic-`ValueFn`.
 * @param fn The function to mark as a faketastic-`ValueFn`.
 */
export function createValueFn(fn: Func<[Buildable], any>): ValueFn {
  return setSymbol(Type, fn, Types.ValueFn);
}
