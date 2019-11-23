import { clone } from '../../util';
import { Buildable, BuildableSymbol, PureObject } from '../types';

export function template<T>(tmpl: PureObject<T>): Buildable<T> {
  return {
    [BuildableSymbol]: 'template',
    value: clone(tmpl),
    processors: [],
  };
}
