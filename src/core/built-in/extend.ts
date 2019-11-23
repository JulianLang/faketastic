import { Buildable, ProcessorFn, PureObject } from '../types';
import { clone, createBuildable, unwrapIfBuildable } from '../util';

export function extend<T, K>(
  tmpl: PureObject<T>,
  extension: K,
  ...processorFns: ProcessorFn[]
): Buildable<T & K> {
  const unwrappedValue = unwrapIfBuildable(tmpl);
  const tmplClone = clone(unwrappedValue);
  const extensionClone = clone(extension);

  const extended = {
    ...tmplClone,
    ...extensionClone,
  };

  return createBuildable(extended, processorFns);
}
