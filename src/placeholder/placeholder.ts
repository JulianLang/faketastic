import { Placeholder, PlaceholderSymbol } from './types/placeholder';

/**
 * Creates a new placeholder.
 * @param typeId (Optional) A string specifiying a placeholder type.
 */
export function placeholder(typeId?: string): Placeholder {
  const placeholderInstance: Partial<Placeholder> = {};
  placeholderInstance[PlaceholderSymbol] = typeId;

  return placeholderInstance as Placeholder;
}
