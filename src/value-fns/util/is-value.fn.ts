import { hasSymbol } from '../../util';
import { ValueFnSymbol } from '../types/value.fn';

export function isValueFunction(fn: Function): boolean {
  return hasSymbol(ValueFnSymbol, fn);
}
