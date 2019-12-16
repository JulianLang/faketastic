/**
 * Sets the value of a specified symbol on a given value.
 * @param symbol The symbol to ask for on the given value.
 * @param withValue The value that should be set for the symbol.
 * @param on The value being holder of a symbol.
 */
export function setSymbol<T, K extends symbol, V = boolean>(
  symbol: K,
  on: T,
  withValue: V = true as any,
): T & Record<K, V> {
  (on as any)[symbol] = withValue;

  return on as T & Record<K, V>;
}
