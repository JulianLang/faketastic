import { isDefined } from '../is-defined';

/**
 * Determines whether a specified symbol is present on a given value.
 * @param symbol The symbol to find on the given value.
 * @param on The value to find the specified symbol on.
 * @returns `true` if the symbol was found on the given value, `false` otherwise.
 */
export function hasSymbol(symbol: symbol, on: any): boolean {
  if (!isDefined(on)) {
    return false;
  }

  return isDefined(on[symbol]);
}
