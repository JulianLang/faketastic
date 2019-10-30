import { Buildable, BuildableSymbol, PureObject } from '../types';
import { template } from './template';

export function use<T>(tmpl: PureObject<T>, ...processors: Function[]): Buildable<T> {
  const tmplCopy = template(tmpl);
  const result = {
    [BuildableSymbol]: 'template',
    ...tmplCopy,
    processors,
  };

  return result;
}
