import { clone } from '../util';
import { Buildable, PureObject } from './types';
import { createBuildable, unwrapIfBuildable } from './util';

export function extend<T, K>(mdl: PureObject<T>, extension: K): Buildable<T & K> {
  const unwrappedValue = unwrapIfBuildable(mdl);
  const mdlClone = clone(unwrappedValue);
  const extensionClone = clone(extension);

  const extended = {
    ...mdlClone,
    ...extensionClone,
  };

  return createBuildable(extended, []);
}
