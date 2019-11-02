import { Buildable, ProcessorFn, PureObject } from '../types';
import { clone, isBuildable } from '../util';
import { createBuildable } from './specs/shared/spec.helper';
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

function unwrapIfBuildable(tmpl: any): any {
  let unwrappedValue = tmpl;

  while (isBuildable(unwrappedValue)) {
    unwrappedValue = unwrappedValue.value;
  }

  return unwrappedValue;
}
