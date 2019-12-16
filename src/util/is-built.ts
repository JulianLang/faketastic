import { isBuilderFunction } from '../builders';
import { BuildCycle, FnBuildCycleSymbol, FnCalledSymbol, isBuildable } from '../core';
import { AttachedFn } from '../types';
import { compareCycles } from './compare-cycles';
import { cyclesOf } from './cycles-of';
import { getSymbol } from './get-symbol';
import { hasSymbol } from './has-symbol';
import { isUndefined } from './is-undefined';

export function isBuilt(value: any, cycle: BuildCycle = 'finalizer'): boolean {
  if (isUndefined(value) || !isBuildable(value)) {
    return true;
  }

  const attachedFns: AttachedFn[] = [
    ...value.architects,
    ...value.processors,
    ...value.treeReaders,
  ];
  const cycles = cyclesOf(cycle);

  const fnsCalled = allFnsCalled(attachedFns, cycles);
  const valueIsNoBuilderFn = compareCycles(cycle, '>=', 'postprocessor')
    ? !isBuilderFunction(value.value)
    : true;

  return fnsCalled && valueIsNoBuilderFn;
}

function allFnsCalled(attachedFns: AttachedFn[], inCycles: BuildCycle[]): boolean {
  for (const fn of attachedFns) {
    const fnCycle: BuildCycle = getSymbol(FnBuildCycleSymbol, fn);

    if (inCycles.includes(fnCycle) && !hasSymbol(FnCalledSymbol, fn)) {
      return false;
    }
  }

  return true;
}
