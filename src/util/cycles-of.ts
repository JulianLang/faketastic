import { BuildCycle } from '../core';

export function cyclesOf(cycle: BuildCycle): BuildCycle[] {
  const cycles: BuildCycle[] = ['initializer', 'preprocessor', 'postprocessor', 'finalizer'];
  const cycleIndex = cycles.indexOf(cycle);

  return cycles.splice(0, cycleIndex + 1);
}
