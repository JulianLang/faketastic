import { hasSymbol } from '../../util/has-symbol';
import { ValueFnSymbol } from '../types/value.fn';

export function isValueFunction(fn: Function): boolean {
  return hasSymbol(ValueFnSymbol, fn);
}
