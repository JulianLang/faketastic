/** Formal description of a javascript function signature. */
export interface Func<T extends Array<any>, R> {
  (...params: T): R;
}
