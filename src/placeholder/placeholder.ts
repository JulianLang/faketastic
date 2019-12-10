import { Buildable, createBuildable } from '../core';
import { AttachedFn } from '../types';
import { setSymbol } from '../util';
import { Placeholder, PlaceholderSymbol } from './types/placeholder';

/**
 * Creates a new placeholder.
 * @param typeId (Optional) A string specifiying a placeholder type.
 */
export function placeholder(typeId?: string, ...attachedFns: AttachedFn[]): Buildable<Placeholder> {
  const placeholder = setSymbol(PlaceholderSymbol, {}, typeId) as Placeholder;

  return createBuildable(placeholder, ...attachedFns);
}
