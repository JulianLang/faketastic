import { isDefined, isUndefined } from '../util';
import { Placeholder, PlaceholderSymbol } from './types/placeholder';

/**
 * Determines whether a given value is a placeholder. Optionally checks for a type-id string.
 * @param value The value to check for being a placeholder
 * @param ofType (Optional) The type-id string of the placeholder.
 */
export function isPlaceholder(value: any, ofType?: string): value is Placeholder {
  if (isUndefined(value)) {
    return false;
  }

  if (isDefined(ofType)) {
    return value[PlaceholderSymbol] === ofType;
  } else {
    return isDefined(value[PlaceholderSymbol]);
  }
}
