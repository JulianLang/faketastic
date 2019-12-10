import { BuilderFnSymbol } from '../../builders';
import { isDefined } from '../../util';

export function isBuilderFunction(fn: Function): boolean {
  return isDefined(fn) && isDefined((fn as any)[BuilderFnSymbol]);
}
