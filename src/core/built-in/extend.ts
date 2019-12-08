import { AttachedFn } from '../../types';
import { clone } from '../../util';
import { Buildable, PureObject } from '../types';
import { createBuildable, unwrapIfBuildable } from '../util';

export function extend<T, K>(
  tmpl: PureObject<T>,
  extension: K,
  ...attachedFns: AttachedFn[]
): Buildable<T & K> {
  const unwrappedValue = unwrapIfBuildable(tmpl);
  const tmplClone = clone(unwrappedValue);
  const extensionClone = clone(extension);

  const extended = {
    ...tmplClone,
    ...extensionClone,
  };

  return createBuildable(extended, attachedFns);
}
