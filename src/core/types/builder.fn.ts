export const BuilderFnSymbol = Symbol('faketastic.builder');
export interface BuilderFn<T = any> {
  [BuilderFnSymbol]: boolean;
  (...params: any[]): T;
}
