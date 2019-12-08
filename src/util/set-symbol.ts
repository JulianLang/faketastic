/**
 * Sets the value of a specified symbol on a given value.
 * @param symbol The symbol to ask for on the given value.
 * @param withValue The value that should be set for the symbol.
 * @param on The value being holder of a symbol.
 */
export function setSymbol<T, K extends symbol>(symbol: K, on: T, withValue: any = true): T & K {
  (on as any)[symbol] = withValue;

  return on as T & K;
}
