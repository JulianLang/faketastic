import { Buildable } from '../core/types/buildable';
import { createBuildable } from '../core/util/create-buildable';
import { AttachedFn } from '../types';
import { setSymbol } from '../util';
import { Placeholder, PlaceholderSymbol } from './types/placeholder';

/**
 * Creates a new placeholder.
 * @param typeId (Optional) A string specifiying a placeholder type.
 */
export function createPlaceholder<T extends {}>(
  typeId?: string,
  content: T = {} as any,
  attachedFns: AttachedFn[] = [],
): Buildable<Placeholder<T>> {
  const placeholder = setSymbol(PlaceholderSymbol, content || {}, typeId) as Placeholder;

  return createBuildable(placeholder, attachedFns);
}
