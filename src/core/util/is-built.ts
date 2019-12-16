import { AttachedFn } from '../../types';
import { getSymbol, hasSymbol, isUndefined } from '../../util';
import { isValueFunction } from '../../value-fns';
import { BuildCycle, FnBuildCycleSymbol, FnCalledSymbol } from '../types';
import { compareCycles, cyclesOf, isBuildable } from '../util';

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
  const isNoValueFn = compareCycles(cycle, '>=', 'postprocessor')
    ? !isValueFunction(value.value)
    : true;

  return fnsCalled && isNoValueFn;
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
