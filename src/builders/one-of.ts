import {
  Buildable,
  BuildableSymbol,
  createBuilderFn,
  isDefined,
  randomInt
} from '../core';

export function oneOf(
  values: any[],
  ...processorFns: Function[]
): Buildable<Function> {
  const oneOfBuilder = createBuilderFn(oneOfImpl);

  return {
    [BuildableSymbol]: 'value',
    value: oneOfBuilder,
    processors: processorFns
  };

  function oneOfImpl() {
    if (!isDefined(values)) {
      throw new Error(
        'Cannot get "oneOf(undefined, …)". First parameter of "oneOf" function must not be null or undefined, but an array.'
      );
    }

    const index = randomInt(0, values.length - 1);

    return values[index];
  }
}
