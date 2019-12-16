export const BuilderFnSymbol = Symbol('faketastic.fns.builder');
export interface BuilderFn<T = any> {
  [BuilderFnSymbol]: boolean;
  (...params: any[]): T;
}
