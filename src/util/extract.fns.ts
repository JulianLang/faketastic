import { hasSymbol } from './has-symbol';

/**
 * Extracts all functions that have a specified symbol defined.
 * @param symbol The symbol that must be present on the wanted functions.
 * @param fns The functions to filter for the wanted symbol.
 */
export function extractFns<T extends symbol>(symbol: T, fns: Function[]): Function[] {
  return fns.filter(fn => hasSymbol(symbol, fn));
}
