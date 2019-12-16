/** Symbol marking an object as a placeholder for a later value. */
export const PlaceholderSymbol = Symbol('faketastic.placeholder');

/** Placeholders are objects that holds the place for a future value. */
export interface Placeholder<T = any> {
  [PlaceholderSymbol]: T;
}
