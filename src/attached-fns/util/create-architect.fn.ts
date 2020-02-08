import { MutationFnReadType, Type, Types } from '../../constants';
import { Func } from '../../types';
import { setSymbol } from '../../util';
import { ArchitectFn } from '../attached.fn';
import { ReadType } from '../read.type';

/**
 * Marks a given function as faketastic-`ArchitectFn`.
 * @param fn The function to mark as `ArchitectFn`.
 * @param readType The desired input-argument type of the function. Defaults to 'value'.
 */
export function createArchitectFn(fn: Func<[any], any>, readType: ReadType = 'value'): ArchitectFn {
  const typedFn = setSymbol(Type, fn, Types.ArchitectFn);

  return setSymbol(MutationFnReadType, typedFn, readType);
}
