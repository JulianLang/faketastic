import { hasSymbol } from '../../util/has-symbol';
import { BuilderFnSymbol } from '../types/builder.fn';

export function isBuilderFunction(fn: Function): boolean {
  return hasSymbol(BuilderFnSymbol, fn);
}
