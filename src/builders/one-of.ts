import { Buildable, BuildableSymbol, createBuilderFn, ProcessorFn, randomInt } from '../core';
import { isDefined } from '../util';

export function oneOf(values: any[], ...processorFns: ProcessorFn[]): Buildable<Function> {
  const oneOfBuilderFn = createBuilderFn(chooseRandomItem);

  return {
    [BuildableSymbol]: 'value',
    value: oneOfBuilderFn,
    processors: processorFns,
  };

  function chooseRandomItem() {
    if (!isDefined(values)) {
      throw new Error(
        'Cannot get "oneOf(undefined, …)". First parameter of "oneOf" function must not be null or undefined, but an array.',
      );
    }

    const index = randomInt(0, values.length - 1);

    return values[index];
  }
}
