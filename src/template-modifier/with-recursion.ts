import { createBuildable, createBuilderFn, ProcessorFn, PureObject } from '../core';
import { Func } from '../types';
import { clone } from '../util';
import { RecursionInstruction } from './types';

/**
 * Creates a recursive template object to be passed to `template` function.
 * @param tmpl The template to be made recursive.
 * @param property The property name that should hold the template recursion.
 * @param processors Processors that must include a `quantity(0, x)` or `canBe(any)` processor,
 * being able to end the recursion at some time. Otherwise you'll get a `StackOverflow` exception.
 */
export function withRecursion<T>(
  tmpl: PureObject<T>,
  property: string,
  endWhen: Func<[T], RecursionInstruction>,
  ...processors: ProcessorFn[]
) {
  const instruction = endWhen(tmpl);

  if (instruction.continue) {
    // add recursive property on level 1
    (tmpl as any)[property] = addRecursiveProperty();
  } else {
    (tmpl as any)[property] = instruction.endWithValue;
  }

  return tmpl;

  /**
   * Creates a `Buildable` property making its holding template recursive.
   * @param property The property name being the recursion root
   * @param tmpl The template to be made recursive
   * @param processors Processors
   */
  function addRecursiveProperty() {
    const builder = createBuilderFn(() => {
      let result = clone(tmpl);

      // add recursive property on deeper levels
      (result as any)[property] = withRecursion(tmpl, property, endWhen, ...processors);

      return result;
    });

    return createBuildable(builder, processors);
  }
}
