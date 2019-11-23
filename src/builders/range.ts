import {
  Buildable,
  BuildableSymbol,
  BuilderFn,
  createBuilderFn,
  ProcessorFn,
  randomInt,
} from '../core';

export function range(min = 1, max = 10, ...processorFns: ProcessorFn[]): Buildable<BuilderFn> {
  const rangeBuilder = createBuilderFn(rangeImpl);

  return {
    [BuildableSymbol]: 'value',
    value: rangeBuilder,
    processors: processorFns,
  };

  function rangeImpl() {
    return randomInt(min, max);
  }
}
