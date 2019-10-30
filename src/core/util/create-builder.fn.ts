import { BuilderFnSymbol } from '../types';

export function createBuilderFn(fn: Function): Function {
  (fn as any)[BuilderFnSymbol] = true;

  return fn;
}
