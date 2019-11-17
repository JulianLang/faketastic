import { BuilderFnSymbol } from '../types';
import { isDefined } from './is-defined';

export function isBuilderFunction(fn: Function): boolean {
  return isDefined(fn) && isDefined((fn as any)[BuilderFnSymbol]);
}
