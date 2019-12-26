import { isDefined } from '../../util/type-fns/is-defined';
import { Buildable, BuildableSymbol } from '../types/buildable';

export function isBuildable(value: any): value is Buildable<any> {
  return isDefined(value) && isDefined(value[BuildableSymbol]);
}
