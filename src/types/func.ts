/** Describes a function signature. */
export interface Func<T extends any[], R> {
  (...params: T): R;
}
