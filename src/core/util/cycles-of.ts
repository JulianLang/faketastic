import { BuildCycle } from '../types/build.cycle';

export function cyclesOf(cycle: BuildCycle): BuildCycle[] {
  const cycles: BuildCycle[] = ['tree-building', 'preprocessor', 'postprocessor', 'finalizer'];
  const cycleIndex = cycles.indexOf(cycle);

  return cycles.splice(0, cycleIndex + 1);
}
