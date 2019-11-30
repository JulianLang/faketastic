import { clone } from '../../util';
import { Buildable, BuildableSymbol } from '../types';

export function template<T>(tmpl: object): Buildable<T> {
  return {
    [BuildableSymbol]: 'template',
    value: clone(tmpl),
    processors: [],
  };
}
