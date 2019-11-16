import { Buildable, BuildableSymbol, createBuilderFn, ProcessorFn, randomInt } from '../core';

export function range(min = 1, max = 10, ...processorFns: ProcessorFn[]): Buildable<Function> {
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
