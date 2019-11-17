export const BuilderFnSymbol = Symbol('faketastic.builder');
export interface BuilderFn {
  [BuilderFnSymbol]: boolean;
  <T>(...params: any[]): T;
}
