import {
  Buildable,
  BuildableSymbol,
  createBuilderFn,
  isArrayOfBuildables,
  isDefined,
  randomInt,
} from '../core';

export function oneOf(values: any[], ...processorFns: Function[]): Buildable<Function> {
  const oneOfBuilderFn = createBuilderFn(chooseRandomItem);

  /* In normal conditions, oneOf will not directly return a value,
     but rather a function that will be called in the "build"-stage,
     which will then return a random value.

     However if oneOf gets an array consisting of Buildable templates only,
     it will instantly choose one of those template, so that this random template
     gets built in "build"-stage, rather than being randomly chosen then.
   */
  return isArrayOfBuildables(values)
    ? chooseRandomItem()
    : {
        [BuildableSymbol]: 'value',
        value: oneOfBuilderFn,
        processors: processorFns,
        properties: {},
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
