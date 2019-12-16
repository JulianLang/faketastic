export const ValueFnSymbol = Symbol('faketastic.fns.values');
export interface ValueFn<T = any> {
  [ValueFnSymbol]: boolean;
  (...params: any[]): T;
}
