import { BuildCycle } from '../core';
import { BuildCycleCallbackFn } from '../types';

export function isInBuildCycle(cycle: BuildCycle, fn: BuildCycleCallbackFn): boolean {
  return true;
}
