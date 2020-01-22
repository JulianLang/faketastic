/**
 * Sets the specified symbol on the given value.
 * @param symbol The symbol to set on the given value.
 * @param on The value to set the specified symbol on.
 * @param value The value to set as value of the symbol.
 * @returns The value with the symbol set.
 */
export function setSymbol<T extends symbol, K, V>(symbol: T, on: K, value?: V): K & Record<T, V> {
  if (value === undefined) {
    value = true as any;
  }

  (on as any)[symbol] = value as any;

  return on as K & Record<T, V>;
}
