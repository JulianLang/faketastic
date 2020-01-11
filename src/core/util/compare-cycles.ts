import { ComparisonOperator } from '../../types/comaprison.operator';
import { BuildCycle } from '../types/build.cycle';

export function compareCycles(a: BuildCycle, operator: ComparisonOperator, b: BuildCycle): boolean {
  const valueOfA = cycleToNumber(a);
  const valueOfB = cycleToNumber(b);

  switch (operator) {
    case '<':
      return valueOfA < valueOfB;
    case '<=':
      return valueOfA <= valueOfB;
    case '>':
      return valueOfA > valueOfB;
    case '>=':
      return valueOfA >= valueOfB;
    default:
      return valueOfA === valueOfB;
  }
}

function cycleToNumber(cycle: BuildCycle): number {
  switch (cycle) {
    case 'tree-building':
      return 0;
    case 'preprocessor':
      return 1;
    case 'postprocessor':
      return 2;
    case 'finalizer':
      return 3;
  }
}
