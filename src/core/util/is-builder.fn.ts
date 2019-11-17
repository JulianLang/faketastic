import { isDefined } from '../../util';
import { BuilderFnSymbol } from '../types';

export function isBuilderFunction(fn: Function): boolean {
  return isDefined(fn) && isDefined((fn as any)[BuilderFnSymbol]);
}
