import { AttachedFn } from '../../types/attached.fn';
import { getSymbol } from '../../util/symbol-fns/get-symbol';
import { hasSymbol } from '../../util/symbol-fns/has-symbol';
import { isUndefined } from '../../util/type-fns/is-undefined';
import { isValueFunction } from '../../value-fns/util/is-value.fn';
import { BuildCycle } from '../types/build.cycle';
import { FnBuildCycleSymbol, FnCalledSymbol } from '../types/symbols';
import { compareCycles } from '../util/compare-cycles';
import { cyclesOf } from '../util/cycles-of';
import { isBuildable } from '../util/is-buildable';

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
