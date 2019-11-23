import { isDefined } from '../../util';
import { Buildable, BuildableSymbol } from '../types';

export function isBuildable(value: any): value is Buildable<any> {
  return isDefined(value) && isDefined(value[BuildableSymbol]);
}
