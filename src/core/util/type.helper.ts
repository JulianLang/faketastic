import { cloneDeep } from 'lodash';
import { Buildable, BuildableSymbol } from '../types';

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined && value !== null;
}

export function isBuildable(value: any): value is Buildable<any> {
  return isDefined(value) && isDefined(value[BuildableSymbol]);
}

export function clone(value: any): any {
  return cloneDeep(value);
}
