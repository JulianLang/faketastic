export const BuildableSymbol = Symbol('Buildable');
export interface Buildable<T = any> {
  [BuildableSymbol]: 'template' | 'value';
  value: T;
  processors: Function[];
}
