import { BuilderFnSymbol } from '../types';
import { isDefined } from './type.helper';

export function isBuilderFunction(fn: Function): boolean {
  return isDefined(fn) && isDefined((fn as any)[BuilderFnSymbol]);
}
