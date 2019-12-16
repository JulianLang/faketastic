import { isDefined } from '../is-defined';
import { isUndefined } from '../is-undefined';

/**
 * Determines
 * @param on The value being holder of a symbol.
 * @param symbol The symbol to ask for on the given value.
 * @param withValue The value being expected for the symbol.
 */
export function hasSymbol(symbol: symbol, on: any, withValue?: any): any {
  if (isUndefined(on)) {
    return false;
  }

  if (isUndefined(withValue)) {
    return isDefined(on[symbol]);
  } else {
    return on[symbol] === withValue;
  }
}
