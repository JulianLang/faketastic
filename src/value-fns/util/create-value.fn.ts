import { Func } from '../../types';
import { setSymbol } from '../../util';
import { ValueFn, ValueFnSymbol } from '../types';

export function createValueFn<T = any>(fn: Func<any[], T>): ValueFn<T> {
  return setSymbol(ValueFnSymbol, fn);
}
