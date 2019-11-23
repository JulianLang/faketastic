import { BuilderFn, BuilderFnSymbol } from '../types';

export function createBuilderFn(fn: Function): BuilderFn {
  const builderFn: any = fn;
  builderFn[BuilderFnSymbol] = true;

  return builderFn;
}
