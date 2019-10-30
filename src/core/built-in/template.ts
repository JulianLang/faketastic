import { Buildable, BuildableSymbol, PureObject } from '../types';
import { clone } from '../util';

export function template<T>(tmpl: PureObject<T>): Buildable<T> {
  return {
    [BuildableSymbol]: 'template',
    value: clone(tmpl),
    processors: [],
  };
}
