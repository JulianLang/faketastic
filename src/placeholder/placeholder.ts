import { Buildable, createBuildable } from '../core';
import { AttachedFn } from '../types';
import { setSymbol } from '../util';
import { Placeholder, PlaceholderSymbol } from './types/placeholder';

/**
 * Creates a new placeholder.
 * @param typeId (Optional) A string specifiying a placeholder type.
 */
export function placeholder<T>(
  typeId?: string,
  content: T = {} as any,
  attachedFns: AttachedFn[] = [],
): Buildable<Placeholder> {
  const placeholder = setSymbol(PlaceholderSymbol, content || {}, typeId) as Placeholder;

  return createBuildable(placeholder, attachedFns);
}
