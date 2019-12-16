import { isUndefined } from '../type-fns/is-undefined';

/**
 * Gets the value of a specified symbol on a given value.
 * @param symbol The symbol to ask for on the given value.
 * @param on The value being holder of a symbol.
 */
export function getSymbol(symbol: symbol, on: any): any {
  if (isUndefined(on)) {
    return undefined;
  }

  return on[symbol];
}
