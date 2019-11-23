import { BuilderFn, BuilderFnSymbol } from '../types';

export function createBuilderFn<T = any>(fn: (...params: any[]) => T): BuilderFn<T> {
  const builderFn: any = fn;
  builderFn[BuilderFnSymbol] = true;

  return builderFn;
}
