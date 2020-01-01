import { clone } from '../util';
import { Buildable } from './types';
import { asBuildable } from './util';

export function model<T>(mdl: T): Buildable<T> {
  const cloned: T = clone(mdl);
  const buildable: Buildable<T> = asBuildable(cloned);

  return buildable;
}
