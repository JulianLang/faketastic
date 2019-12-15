import { BuildCycle, FnCalledSymbol, isBuildable } from '../core';
import { hasSymbol } from './has-symbol';
import { isUndefined } from './is-undefined';

export function isBuilt(value: any, cycle: BuildCycle = 'finalizer'): boolean {
  if (isUndefined(value)) {
    return true;
  }
  if (!isBuildable(value)) {
    return true;
  }

  const architects = value.architects;
  const processors = value.processors;
  const treeReaders = value.treeReaders;

  for (const fn of [...architects, ...processors, ...treeReaders]) {
    if (!hasSymbol(FnCalledSymbol, fn)) {
      return false;
    }
  }

  return true;
}
