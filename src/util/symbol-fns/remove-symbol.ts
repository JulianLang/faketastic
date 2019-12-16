/**
 * Removes the specified symbol from a given value.
 * @param symbol The symbol to remove from the given value.
 * @param value The value holding the symbol.
 */
export function removeSymbol(symbol: symbol, value: any): any {
  delete (value as any)[symbol];

  return value;
}
