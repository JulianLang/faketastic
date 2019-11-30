import { clone } from '../../util';
import { Buildable } from '../types';
import { asBuildable } from '../util';

export function template<T>(tmpl: T): Buildable<T> {
  const cloned: T = clone(tmpl);
  const buildable: Buildable<T> = asBuildable(cloned);

  return buildable;
}
