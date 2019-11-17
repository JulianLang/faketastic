import { Buildable, BuildableSymbol } from '../types';
import { isDefined } from './is-defined';

export function isBuildable(value: any): value is Buildable<any> {
  return isDefined(value) && isDefined(value[BuildableSymbol]);
}
