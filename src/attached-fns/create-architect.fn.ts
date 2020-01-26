import { Type, Types } from '../constants';
import { Func } from '../types';
import { setSymbol } from '../util';
import { ArchitectFn } from './attached.fn';

/**
 * Marks a given function as faketastic-`ArchitectFn`.
 * @param fn The function to mark as `ArchitectFn`.
 */
export function createArchitectFn(fn: Func<[any], any>): ArchitectFn {
  return setSymbol(Type, fn, Types.ArchitectFn);
}
